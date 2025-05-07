<template>
  <div class="container d-flex justify-content-center align-items-center bg-light py-5">
    <div class="card p-5 shadow rounded w-100" style="max-width: 500px">
      <h2 class="logo-text text-center mb-3 fw-bold">Sign Up</h2>
      <p class="text-center text-muted mb-0">처음 오셨군요, 환영합니다!</p>
      <p class="text-center text-muted mb-4">서비스를 이용하기 위해 아래 정보를 입력해주세요.</p>

      <div class="mb-3">
        <label class="form-label fw-bold">별명</label>
        <div class="input-group">
          <input type="text" class="form-control" :class="{ 'is-invalid': signupStore.isNicknameDuplicate === true, 'is-valid': signupStore.isNicknameDuplicate === false }" v-model="signupStore.member.nickname" maxlength="15" />
          <button class="btn btn-outline-secondary" type="button" @click="checkNicknameDuplicate">중복 검사</button>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold">성별</label>
        <select class="form-select" v-model="signupStore.member.gender">
          <option disabled value="">선택하세요</option>
          <option value="M">남성</option>
          <option value="F">여성</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold">생년월일</label>
        <input type="date" class="form-control" v-model="signupStore.member.birth" />
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold">활동지역</label>
        <div class="row g-2">
          <div class="col">
            <select v-model="signupStore.member.sido" class="form-select text-center">
              <option disabled value="">시/도</option>
              <option v-for="sido in Object.keys(regionData)" :key="sido" :value="sido">{{ sido }}</option>
            </select>
          </div>

          <div class="col">
            <select v-model="signupStore.member.sigungu" class="form-select text-center" :disabled="!signupStore.member.sido">
              <option disabled value="">시/군/구</option>
              <option v-for="gu in regionData[signupStore.member.sido] || []" :key="gu" :value="gu">{{ gu }}</option>
            </select>
          </div>
        </div>
      </div>

      <button class="btn btn-dark w-100 mt-3" @click="goToNextStep">다음으로</button>
    </div>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import { regionData } from '../data/region-data'
  import memberService from '../api/member-service';
  import { useRouter } from 'vue-router'
  import { useAlertStore } from '../stores/alertStore';
  import { useSignupStore } from '../stores/signupStore'

  const router = useRouter()
  const alertStore = useAlertStore();
  const signupStore = useSignupStore()

  // 닉네임 중복 체크
  const checkNicknameDuplicate = async () => {
    if (!signupStore.member.nickname?.trim()) {
      alertStore.showAlert('별명을 입력해주세요.')
      return
    }

    try {
      await memberService.validNickname(signupStore.member.nickname)
      signupStore.isNicknameDuplicate = false
    } catch (error) {
      signupStore.isNicknameDuplicate = true
      alertStore.showAlert(error.response?.data?.message || '알 수 없는 오류 발생')
    }
  }

  // 닉네임 변경 시 중복 체크 초기화
  watch(() => signupStore.member.nickname, () => {
    signupStore.isNicknameDuplicate = null
  })

  // 성별 변경될 때 기본 이미지 바꾸기
  watch(() => signupStore.member.gender, (newGender) => {
    if (newGender === 'M') {
      signupStore.member.profileImage = '/man.png'
    } else if (newGender === 'F') {
      signupStore.member.profileImage = '/woman.png'
    }
  })

  // 시/도 변경 시 시/군/구 초기화
  watch(() => signupStore.member.sido, () => {
    signupStore.member.sigungu = '' // 시/도 변경 시 시/군/구 초기화
  })

  // 다음으로 버튼 클릭 시 각 필드 유효성 검사 후 다음 단계로 이동
  const goToNextStep = () => {
    if (!signupStore.member.nickname.trim() || !signupStore.member.gender || !signupStore.member.birth || !signupStore.member.sido || !signupStore.member.sigungu) {
      alertStore.showAlert('모든 필드를 입력해주세요.')
      return
    }

    if (signupStore.isNicknameDuplicate === null) {
      alertStore.showAlert('별명 중복 검사를 해주세요.')
      return
    }

    if (signupStore.isNicknameDuplicate === true) {
      alertStore.showAlert('별명이 중복됩니다.')
      return
    }

    router.push('/signup/step2')
  }
</script>

<style scoped>
</style>
