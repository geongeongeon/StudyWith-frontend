<template>
  <div class="container d-flex justify-content-center align-items-center bg-light py-5">
    <div class="card p-5 shadow rounded w-100" style="max-width: 500px">
      <h2 class="logo-text text-center mb-3 fw-bold">Sign Up</h2>
      <p class="text-center text-muted mb-0">처음 오셨군요, 환영합니다!</p>
      <p class="text-center text-muted mb-4">아래 항목은 선택 사항이며, 미입력 시 기본값이 적용됩니다.</p>

      <div class="mb-3">
        <label class="form-label fw-bold d-block">프로필사진 (선택)</label>
        <div class="text-center">
          <img :src="preview" class="border mb-2" style="width: 200px; height: 200px; object-fit: contain;"/>
        </div>
        <input type="file" class="form-control" accept="image/*" @change="handleFileChange" />
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold">자기소개 (선택)</label>
        <textarea class="form-control" v-model="signupStore.member.bio" maxlength="100" placeholder="100자 이내로 입력하세요." style="resize: none; overflow: hidden;" @input="autoResize"></textarea>
      </div>

      <button class="btn btn-dark w-100 mt-3" @click="submit">시작하기</button>
      <button class="btn btn-secondary w-100 mt-3" @click="previous">이전으로</button>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import memberService from '../api/member-service'
  import { useRouter } from 'vue-router'
  import { useAlertStore } from '../stores/alertStore'
  import { useSignupStore } from '../stores/signupStore'

  const router = useRouter()
  const alertStore = useAlertStore();
  const signupStore = useSignupStore()

  const preview = ref(signupStore.member.profileImage)

  // 파일 선택 시 미리보기 이미지를 보여주고, 프로필 이미지로 저장
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      signupStore.member.profileImage = file

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

  // 뒤로가기
  const previous = async () => {
    router.back();
  }

  // 유효성 검사 후 폼 제출
  const submit = async () => {
    if (signupStore.member.profileImage == '/man.png' || signupStore.member.profileImage == '/woman.png') {
      signupStore.member.profileImage = null;
    }

    try {
      const createMemberDTO = { 
        ...signupStore.member,
        region: `${signupStore.member.sido} ${signupStore.member.sigungu}`,
        profileImage: null
      };

      const formData = new FormData();

      console.log(createMemberDTO)
      formData.append('memberCreateDTO', new Blob([JSON.stringify(createMemberDTO)], { type: 'application/json' }));
      if (signupStore.member.profileImage instanceof File) {
        formData.append('profileImage', signupStore.member.profileImage);
      }

      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await memberService.createMember(formData)

      if (response.status === 201) {
        signupStore.resetMember()
        router.replace('/')
      }
    } catch (error) {
      alertStore.showAlert(error.response.data.message)
    }
  }
</script>

<style scoped>
</style>