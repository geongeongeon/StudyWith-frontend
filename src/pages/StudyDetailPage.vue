<template>
  <div class="px-3 pt-3">
    <p class="text-muted small mb-0">※ 부관리자가 없을 경우, 해당 항목은 비어 있을 수 있습니다.</p>
    <p class="text-muted small mb-3">※ 모집 상태만 수정할 수 있으며, 상태 변경 시 자동으로 저장됩니다.</p>

    <div class="p-3" v-if="study">
      <div class="py-1 row">
        <div class="col-md-4 text-center">
          <div class="mb-2">
            <label class="defaultCursor">
                <input role="switch" type="checkbox" v-model="isRecruit" @click="updateRecruitmentStatus" v-if="(authStore.nickname === study.manager) || (authStore.nickname === study.subManager)"/>
                <input role="switch" type="checkbox" v-model="isRecruit" disabled v-else />
            </label>
          </div>

          <img :src="`${study.thumbnailImage}` "class="img-thumbnail"  style="width: 200px; height: 200px; object-fit: cover;" />

          <div class="mt-2 mb-3">
            <span class="badge bg-secondary me-1 rounded-5" v-for="(tag, index) in study.tags" :key="index">{{ tag }}</span>
          </div>
        </div>

        <div class="col-md-8">
          <div class="mb-3 row">
            <label class="col-sm-3 col-form-label fw-bold">스터디명</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" :value="study.title" disabled>
            </div>
          </div>

          <div class="mb-3 row">
            <label class="col-sm-3 col-form-label fw-bold">총관리자</label>
            <div class="col-sm-9 d-flex align-items-center">
              <input type="text" class="form-control" :value="study.manager" disabled>
            </div>
          </div>

          <div class="mb-3 row">
            <label class="col-sm-3 col-form-label fw-bold">부관리자</label>
            <div class="col-sm-9 d-flex align-items-center">
              <input type="text" class="form-control" :value="study.subManager" disabled>
            </div>
          </div>

          <div class="mb-3 row">
            <label class="col-sm-3 col-form-label fw-bold">활동지역</label>
            <div class="col-sm-9 d-flex align-items-center">
              <input type="text" class="form-control" :value="study.region" disabled>
            </div>
          </div>

          <div class="mb-3 row">
            <label class="col-sm-3 col-form-label fw-bold">총회원수</label>
            <div class="col-sm-9 d-flex align-items-center">
              <input type="text" class="form-control" :value="`${study.memberCount} 명`" disabled>
            </div>
          </div>

          <div class="mb-3 row">
            <label class="col-sm-3 col-form-label fw-bold">생성날짜</label>
            <div class="col-sm-9 d-flex align-items-center">
              <input type="text" class="form-control" :value="study.createDate" disabled>
            </div>
          </div>

          <div class="row">
            <label class="col-sm-3 col-form-label fw-bold">수정날짜</label>
            <div class="col-sm-9 d-flex align-items-center">
              <input type="text" class="form-control" :value="study.modifyDate" disabled>
            </div>
          </div>
        </div>  

        <div class="mt-5 mb-1 text-center" v-if="study.myRole === 'guest' && study.isRecruit">
          <button class="px-5 btn btn-dark" @click="requestToJoinStudy">가입신청</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
  import { nextTick, onMounted, ref } from 'vue';
  import studyService from '../api/study-service';
  import { useRoute } from 'vue-router';
  import { useAlertStore } from '../stores/alertStore';
  import { useAuthStore } from '../stores/authStore';

  const route = useRoute();
  const studyId = route.params.id;
  const study = ref(null)
  const studyTextarea = ref(null)
  const isRecruit = ref(false);
  const alertStore = useAlertStore();
  const authStore = useAuthStore();

  onMounted(async() => {
    const response = await studyService.getStudy(studyId);
    study.value = response.data.data;
    isRecruit.value = study.value.isRecruit;

    await nextTick();
    autoResize();
  })

  // 내용에 맞춰서 입력 필드 높이 조정
  const autoResize = () => {
    const textarea = studyTextarea.value

    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = textarea.scrollHeight + 'px'
    }
  }

  const updateRecruitmentStatus = async () => {
    try {
      const response = await studyService.updateRecruitmentStatus(studyId);
      window.location.reload()
    } catch (error) {
      alertStore.showFailedAlert(error.response?.data?.message || '오류가 발생했습니다.')
    }
  }

  const requestToJoinStudy = async () => {
    try {
      const response = await studyService.requestToJoinStudy(studyId);
      alertStore.showSuccessAlert(response.data.message);
    } catch (error) {
      alertStore.showFailedAlert(error.response?.data?.message || '오류가 발생했습니다.')
    }
  }
</script>

<style scoped>
  .defaultCursor input[disabled] {
    cursor: default;
  }

  label {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
  }

  [type="checkbox"] {
      appearance: none;
      position: relative;
      border: max(2px, 0.1em) solid gray;
      border-radius: 2em;
      width: 5.25em;
      height: 2.1em;
  }

  [type="checkbox"]:hover {
    cursor: pointer;
  }

  [type="checkbox"]::after {
    content: "CLOSE";
    position: absolute;
    top: 50%;
    left: 33px;
    transform: translateY(-50%);
    font-size: 0.75em;
    color: gray;
    font-weight: bold;
    transition: content 0.2s ease;
  }

  [type="checkbox"]:checked::after {
    content: "OPEN";
    color: white;
    left: 10px;
  }

  [type="checkbox"]::before {
      content: "";
      position: absolute;
      left: 0;
      width: 2em;
      height: 1.8em;
      border-radius: 50%;
      transform: scale(0.8);
      background-color: gray;
      transition: left 250ms linear;
  }

  [type="checkbox"]:checked::before {
      background-color: white;
      left: 3em;
  }
    
  [type="checkbox"]:checked {
      background-color: rgb(0, 0, 0);
      border-color: rgb(0, 0, 0);
  }

  [type="checkbox"]:enabled:hover {
      box-shadow: 0 0 0 max(4px, 0.2em) #61616124;
  }
</style>