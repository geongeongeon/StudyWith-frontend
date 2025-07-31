<template>
  <div class="p-3">
    <p class="text-muted small mb-0">※ 일부 정보는 변경할 수 없습니다.</p>
    <p class="text-muted small mb-3">※ 꼭 변경이 필요한 경우, 관리자에게 문의해주세요.</p>

    <div class="text-center mb-3">
      <label class="form-label fw-bold">프로필사진</label>
      <div>
        <img id="profile-img" :src="preview" class="border" style="width: 200px; height: 200px; object-fit: contain;" @click="triggerFileInput"/>
      </div>
      <input class="form-control d-none" type="file" ref="fileInput" accept="image/*" @change="handleFileChange" />
    </div>

    <div class="row g-5 mx-1">
      <div class="col-md-6">
        <div class="mb-3">
          <label class="form-label fw-bold">별명</label>
          <div class="input-group">
            <input type="text" class="form-control" :class="{ 'is-invalid': profileStore.isNicknameDuplicate === true, 'is-valid': profileStore.isNicknameDuplicate === false }" maxlength="15" v-model="tempProfile.nickname" />
            <button class="btn btn-outline-secondary" type="button" @click="checkNicknameDuplicate"><i class="bi bi-search"></i></button>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">이메일</label>
          <div class="input-group">
            <input type="text" class="form-control" v-model="tempProfile.email"  />
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">활동지역</label>
          <div class="row g-2">
            <div class="col">
              <select v-model="tempProfile.sido" class="form-select text-center">
                <option disabled value="">시/도</option>
                <option v-for="sido in Object.keys(regionData)" :key="sido" :value="sido">{{ sido }}</option>
              </select>
            </div>

            <div class="col">
              <select v-model="tempProfile.sigungu" class="form-select text-center" :disabled="!tempProfile.sido">
                <option disabled value="">시/군/구</option>
                <option v-for="gu in regionData[tempProfile.sido] || []" :key="gu" :value="gu">{{ gu }}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">자기소개</label>
          <textarea class="form-control" v-model="tempProfile.bio" maxlength="100" placeholder="100자 이내로 입력하세요." style="resize: none; overflow: hidden" ref="bioTextarea" @input="autoResize"></textarea>
        </div>
      </div>

      <div class="col-md-6">
        <div class="mb-3">
          <label class="form-label fw-bold">성별</label>
          <div class="input-group">
            <input type="text" class="form-control" :value="profileStore.member.gender" disabled />
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">생년월일</label>
          <div class="input-group">
            <input type="text" class="form-control" :value="profileStore.member.birth" disabled />
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">가입날짜</label>
          <div class="input-group">
            <input type="text" class="form-control" :value="profileStore.member.createDate" disabled />
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">변경날짜</label>
          <div class="input-group">
            <input type="text" class="form-control" :value="profileStore.member.modifyDate" disabled />
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-center gap-3 mt-3">
      <button @click="resetForm" class="btn btn-secondary" style="max-width: 150px; width: 100%;">되돌리기</button>
      <button @click="saveForm" class="btn btn-dark" style="max-width: 150px; width: 100%;">저장하기</button>
    </div>
  </div>
</template>

<script setup>
  import { nextTick, onMounted, ref, watch } from 'vue'
  import { regionData } from '../data/region-data'
  import { useAlertStore } from '../stores/alertStore'
  import memberService from '../api/member-service'
  import { useProfileStore } from '../stores/profileStore'

  const profileStore = useProfileStore()
  const alertStore = useAlertStore()

  const fileInput = ref(null)
  const tempProfile = ref({})
  const preview = ref('')
  const initialized = ref(true)
  const bioTextarea = ref(null)

  // 페이지가 로드될 때
  onMounted(async (event) => {
    const response = await memberService.getMemberDetail()
    profileStore.setProfile(response.data.data)
    tempProfile.value = { ...profileStore.member }
    preview.value = profileStore.member.profileImage

    nextTick(() => {
      autoResize()
    })
  })

  // 프로필 이미지 선택 시, 숨겨져있던 input 태그 클릭
  const triggerFileInput = () => {
    fileInput.value?.click()
  }

  // 파일 선택 시 미리보기 이미지를 보여주고, 프로필 이미지로 저장
  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      tempProfile.value.profileImage = file

      const reader = new FileReader()
      reader.onload = () => {
        preview.value = reader.result
      }
      reader.readAsDataURL(file)
    }
  }

  // 닉네임 중복 체크
  const checkNicknameDuplicate = async () => {
    if (tempProfile.value.nickname === profileStore.member.nickname) {
      alertStore.showFailedAlert('기존의 별명과 동일합니다. 다른 별명을 입력해주세요.')
      return
    }

    if (!tempProfile.value.nickname?.trim()) {
      alertStore.showFailedAlert('별명을 입력해주세요.')
      return
    }

    try {
      await memberService.validNickname(tempProfile.value.nickname)
      profileStore.isNicknameDuplicate = false
    } catch (error) {
      profileStore.isNicknameDuplicate = true
      alertStore.showFailedAlert(error.response?.data?.message || '오류가 발생했습니다.')
    }
  }

  // 닉네임 변경 시 중복 체크 초기화
  watch(() => tempProfile.value.nickname, () => {
    profileStore.isNicknameDuplicate = null
  })

  // 내용에 맞춰서 입력 필드 높이 조정
  const autoResize = () => {
    const textarea = bioTextarea.value

    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = textarea.scrollHeight + 'px'
    }
  }

  // 시/도 변경 시 시/군/구 초기화
  watch(() => tempProfile.value.sido, () => {
    if (!initialized.value) {
      tempProfile.value.sigungu = ''
    } else {
      initialized.value = false
    }
  })

  // 변경 내용 초기화
  const resetForm = () => {
    initialized.value = true
    tempProfile.value = { ...profileStore.member }
    preview.value = tempProfile.value.profileImage
  }

  // 변경 내용 저장
  const saveForm = async () => {
    if (profileStore.member.profileImage === tempProfile.value.profileImage 
      && profileStore.member.nickname === tempProfile.value.nickname 
      && profileStore.member.email === tempProfile.value.email
      && profileStore.member.sido === tempProfile.value.sido
      && profileStore.member.sigungu === tempProfile.value.sigungu
      && profileStore.member.bio === tempProfile.value.bio) {
        alertStore.showFailedAlert('변경 내역이 없습니다.')
        return
      }

    try {
      const updateMemberDTO = { 
        nickname: tempProfile.value.nickname, 
        email: tempProfile.value.email,
        region: `${tempProfile.value.sido} ${tempProfile.value.sigungu}`,
        profileImage: null,
        bio: tempProfile.value.bio
      };
      
      const formData = new FormData()
      formData.append('memberUpdateDTO', new Blob([JSON.stringify(updateMemberDTO)], { type: 'application/json' }));
      if (tempProfile.value.profileImage instanceof File) {
        formData.append('profileImage', tempProfile.value.profileImage);
      }

      const response = await memberService.updateMember(formData)
      
      profileStore.setProfile(response.data.data)
      window.location.reload()
    } catch (error) {
      alertStore.showFailedAlert(error.response?.data?.message || '오류가 발생했습니다.')
    }
  }
</script>

<style scoped>
  #profile-img {
    transition: opacity 0.3s ease;
    cursor: pointer;
  }

  #profile-img:hover {
    opacity: 0.5;
  }

  .input-group > .btn {
    flex-grow: 1;
    max-width: 100px;
  }

  .input-group > input {
    flex-grow: 4;
  }

  .input-group .form-control,.input-group .btn-outline-secondary {
    border-color: #ced4da;
  }
</style>