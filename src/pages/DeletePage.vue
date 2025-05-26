<template>
  <div class="p-3 d-flex justify-content-center align-items-center h-100">
    <div class="card p-5 shadow rounded text-center" style="width: 700px">
      <i class="bi bi-emoji-tear fs-1 mb-4"></i>
      <p class="mb-1 text-secondary">이렇게 떠나신다니 정말 아쉽네요.</p>
      <p class="mb-1 text-secondary">
        그동안 <strong class="text-dark">Study With</strong> 서비스를 이용해주셔서 감사합니다.
      </p>
      <p class="mb-4 text-secondary">
        회원을 탈퇴한 후에는 <span class="text-danger fw-bold">다시 복구할 수 없습니다.</span>
      </p>

      <div class="d-flex justify-content-center gap-2 align-items-center">
        <p class="mb-1 text-secondary">정말로 탈퇴하시겠습니까?</p>
        <input class="form-check-input custom-checkbox" type="checkbox" v-model="isConfirmed" style="border: 2px solid #dc3545; position: relative; top: -2.5px;"/>
      </div>

      <transition name="fade" class="mb-1">
        <input v-show="isConfirmed" v-model="inputBox" :class="{ 'is-valid': inputBox === '탈퇴하겠습니다.' }" class="w-75 py-1 mx-auto form-control text-center bg-light fw-bold" type="text" placeholder="여기에 '탈퇴하겠습니다.'라고 입력해주세요."/>
      </transition>

      <button class="btn btn-dark mx-auto w-25 mt-4" @click="deleteMember">탈퇴하기</button>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useAlertStore } from '../stores/alertStore'
  import memberService from '../api/member-service'
  import { useAuthStore } from '../stores/authStore'

  const alertStore = useAlertStore()

  const isConfirmed = ref(false)
  const inputBox = ref(null)

  // 회원 탈퇴
  const deleteMember = async () => {
    if (isConfirmed.value && inputBox.value === '탈퇴하겠습니다.') {
      const response = await memberService.deleteMember()

      if (response.data.code == '200') {
        const authStore = useAuthStore()
        authStore.clear()
        sessionStorage.removeItem('isLoggedIn')
        window.location.href = '/'
      } else {
        alertStore.showAlert(response.data.message)
      }
    } else {
      alertStore.showAlert('체크박스를 클릭하고, 문구를 정확히 입력해주세요.')
    }
  }
</script>

<style scoped>
  .custom-checkbox:hover {
    cursor: pointer;
  }

  .custom-checkbox:checked {
    background-color: #dc3545;
    border-color: #dc3545;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.4s ease, transform 0.4s ease;
  }

  .fade-enter-from, .fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }

  input::placeholder {
    font-weight: 400;
  }
</style>
