<template>
  <div class="container d-flex justify-content-center align-items-center bg-light py-5">
    <div class="card p-5 shadow rounded w-100" style="max-width: 500px">
      <h2 class="logo-text text-center mb-3 fw-bold">Sign Up</h2>
      <p class="text-center text-muted mb-0">처음 오셨군요, 환영합니다!</p>
      
      <template v-if="step === 1">
        <p class="text-center text-muted mb-4">서비스를 이용하기 위해 아래 정보를 입력해주세요.</p>

        <div class="mb-3">
          <label class="form-label fw-bold">별명</label>
          <div class="input-group">
            <input type="text" class="form-control" :class="{ 'is-invalid': isNicknameDuplicate === true, 'is-valid': isNicknameDuplicate === false }" v-model="member.nickname" maxlength="15" />
            <button class="btn btn-outline-secondary" type="button" @click="checkNicknameDuplicate">중복 체크</button>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">성별</label>
          <select class="form-select" v-model="member.gender">
            <option disabled value="">선택하세요</option>
            <option value="M">남성</option>
            <option value="F">여성</option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">생년월일</label>
          <input type="date" class="form-control" v-model="member.birth" />
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">활동지역</label>
          <div class="row g-2">
            <div class="col">
              <select v-model="selectedSido" class="form-select text-center">
                <option disabled value="">시/도</option>
                <option v-for="sido in Object.keys(regionData)" :key="sido" :value="sido">{{ sido }}</option>
              </select>
            </div>

            <div class="col">
              <select v-model="selectedSigungu" class="form-select text-center" :disabled="!selectedSido">
                <option disabled value="">시/군/구</option>
                <option v-for="gu in regionData[selectedSido] || []" :key="gu" :value="gu">{{ gu }}</option>
              </select>
            </div>
          </div>
        </div>

        <button class="btn btn-dark w-100 mt-3" @click="goToNextStep">다음으로</button>
      </template>

      <template v-else-if="step === 2">
        <p class="text-center text-muted mb-4">아래 항목은 선택 사항이며, 미입력 시 기본값이 적용됩니다.</p>

        <div class="mb-3">
          <label class="form-label fw-bold d-block">프로필사진 (선택)</label>
          <div class="text-center">
            <img :src="preview || defaultImage" class="border mb-2" style="width: 200px; height: 200px; object-fit: contain;"/>
          </div>
          <input type="file" class="form-control" @change="handleFileChange" />
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">자기소개 (선택)</label>
          <textarea class="form-control" v-model="member.bio" maxlength="100" placeholder="100자 이내로 입력하세요." style="resize: none; overflow: hidden;" @input="autoResize"></textarea>
        </div>

        <button class="btn btn-dark w-100 mt-3" @click="submit">시작하기</button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { regionData } from '../data/region-data'

const step = ref(1)

const member = ref({
  nickname: '', gender: '', birth: '', region: '', bio: '', profileImage: null
})

const isNicknameDuplicate = ref(null)

const selectedSido = ref('')
const selectedSigungu = ref('')

const defaultImage = ref(null)
const preview = ref(null)

// 닉네임 중복 체크
const checkNicknameDuplicate = () => {
  if (!member.value.nickname?.trim()) {
    alert('별명을 입력해주세요.')
    return
  }

  isNicknameDuplicate.value = false
  console.log(isNicknameDuplicate.value)
}

// 닉네임 변경 시 중복 체크 초기화
watch(() => member.value.nickname, () => {
  isNicknameDuplicate.value = null
})

// 시/도 변경 시 시/군/구 초기화
watch(selectedSido, (newVal) => {
  selectedSigungu.value = ''
})

// 다음으로 버튼 클릭 시 각 필드 유효성 검사 후 다음 단계로 이동
const goToNextStep = () => {
  const { nickname, gender, birth } = member.value

  if (!nickname.trim() || !gender || !birth || !selectedSido.value || !selectedSigungu.value) {
    alert('모든 필드를 입력해주세요.')
    return
  }

  if (isNicknameDuplicate.value == null) {
    alert('별명 중복 체크를 해주세요.')
    return
  }

  member.value.region = `${selectedSido.value} ${selectedSigungu.value}`
  step.value++
}

// 성별 변경될 때 기본 이미지 바꾸기
watch(() => member.value.gender, (newGender) => {
  if (newGender === 'M') {
    defaultImage.value = '/man.png'
  } else if (newGender === 'F') {
    defaultImage.value = '/woman.png'
  }
})

// 파일 선택 시 미리보기 이미지를 보여주고, 프로필 이미지로 저장
const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    member.value.profileImage = file

    const reader = new FileReader()
    reader.onload = () => {
      preview.value = reader.result
    }
    reader.readAsDataURL(file)
  }
}

// 내용에 맞춰서 입력 필드 높이 조정
const autoResize = (event) => {
  const textarea = event.target
  textarea.style.height = 'auto'
  textarea.style.height = textarea.scrollHeight + 'px'
}

const submit = () => {
  if (!member.value.bio.trim()) {
    member.value.bio = '안녕하세요? 만나서 반갑습니다.'
  }

  console.log('제출 데이터:', member.value)
}
</script>

<style scoped>
</style>