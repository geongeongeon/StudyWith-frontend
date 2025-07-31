<template>
  <div class="container d-flex justify-content-center align-items-center bg-light py-5">
    <div class="card p-5 shadow rounded w-100" style="max-width: 700px;">
      <h2 class="text-center mb-3 fw-bold">Create Study</h2>
      <p class="text-center text-muted mb-4">내가 원하는 스터디를 직접 만들고 관리하세요!</p>

      <div class="mb-3">
        <label class="form-label fw-bold">대표 이미지</label>
        <div class="text-center">
          <img id="thumbnail-img" :src="preview" class="border" style="width: 300px; height: 200px; object-fit: cover;" @click="triggerFileInput"/>
        </div>
        <input class="form-control d-none" type="file" ref="fileInput" accept="image/*" @change="handleFileChange"/>
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold">스터디 이름</label>
        <input v-model="form.title" type="text" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold">스터디 소개</label>
        <textarea v-model="form.description" class="form-control" style="resize: none; overflow: hidden;" maxlength="255" required @input="autoResize"></textarea>
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold">활동 지역</label>
        <div class="row g-2">
          <div class="col">
            <select v-model="form.sido" class="form-select text-center">
              <option disabled value="">시/도</option>
              <option v-for="sido in Object.keys(regionData)" :key="sido" :value="sido">{{ sido }}</option>
            </select>
          </div>

          <div class="col">
            <select v-model="form.sigungu" class="form-select text-center" :disabled="!form.sido">
              <option disabled value="">시/군/구</option>
              <option v-for="gu in regionData[form.sido] || []" :key="gu" :value="gu">{{ gu }}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="mb-3">
        <div class="d-flex justify-content-between">
          <label class="form-label fw-bold">태그</label>
          <div>
            <span class="ms-2 fw-bold">
              <i class="bi" :class="plusHovered ? 'bi bi-plus-circle-fill' : 'bi bi-plus-circle'" @mouseover="plusHovered = true" @mouseleave="plusHovered = false" style="cursor: pointer;" @click="addTag"></i>
            </span>
            <span class="ms-1 fw-bold">
              <i class="bi" :class="minusHovered ? 'bi bi-dash-circle-fill' : 'bi bi-dash-circle'" @mouseover="minusHovered = true" @mouseleave="minusHovered = false" style="cursor: pointer;" @click="removeTag"></i>
            </span>
          </div>
        </div>
        <div v-for="(tag, index) in form.tags" :key="index">
          <input v-model="form.tags[index]" type="text" class="form-control mb-2 text-dark" :placeholder="`${index + 1}.`"/>
        </div>
      </div>

      <div class="text-center">
        <button type="button" class="btn btn-dark px-5" @click="createStudy">생성하기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { nextTick, reactive, ref, watch } from 'vue'
  import { regionData } from '../data/region-data'
  import studyService from '../api/study-service'
  import { useAlertStore } from '../stores/alertStore'
  import { useRouter } from 'vue-router';

  const alertStore = useAlertStore();
  const preview = ref('/home.jpg')
  const fileInput = ref(null)
  const plusHovered = ref(false)
  const minusHovered = ref(false)
  const router = useRouter()

  const autoResize = (event) => {
    const textarea = event.target
    
    nextTick(() => {
      textarea.style.height = 'auto'
      textarea.style.height = textarea.scrollHeight + 'px'
    })
  }

  const addTag = () => {
    if (form.tags.length < 3) {
      form.tags.push('')
    }
  }

  const removeTag = () => {
    if (form.tags.length > 1) {
      form.tags.pop()
    }
  }

  const form = reactive({
    title: '',
    description: '',
    sido: '',
    sigungu: '',
    tags: [''],
    thumbnail: null
  })

  const triggerFileInput = () => {
    fileInput.value?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      form.thumbnail = file
      const reader = new FileReader()
      reader.onload = () => {
        preview.value = reader.result
      }
      reader.readAsDataURL(file)
    }
  }

  watch(() => form.sido, () => {
    form.sigungu = ''
  })

  const createStudy = async () => {
    const studyCreateDTO = {
      title: form.title,
      description: form.description,
      region: `${form.sido} ${form.sigungu}`,
      tags: [...form.tags]
    }

    const formData = new FormData()

    formData.append('studyCreateDTO', new Blob([JSON.stringify(studyCreateDTO)], { type: 'application/json' }));
    if (form.thumbnail instanceof File) {
      formData.append('thumbnailImage', form.thumbnail);
    }

    try {
      const response = await studyService.createStudy(formData);

      if (response.status === 201) {
        router.replace('/studies')
      }
    } catch (error) {
      alertStore.showFailedAlert(error.response?.data?.message || '오류가 발생했습니다.')
    }
  }
</script>

<style scoped>
  #thumbnail-img {
    transition: opacity 0.3s ease;
    cursor: pointer;
  }

  #thumbnail-img:hover {
    opacity: 0.5;
  }
</style>