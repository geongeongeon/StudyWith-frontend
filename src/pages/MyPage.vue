<template>
  <div class="container d-flex">
    <aside class="border-end p-3">
      <ul class="nav flex-column ">
        <li class="nav-item p-3" :class="{ active: activeMenu === 'PROFILE' }" @click="activeMenu = 'PROFILE'">PROFILE</li>
        <li class="nav-item p-3" :class="{ active: activeMenu === 'STUDY' }" @click="activeMenu = 'STUDY'">STUDY</li>
        <li class="nav-item p-3" :class="{ active: activeMenu === 'DELETE' }" @click="activeMenu = 'DELETE'">DELETE</li>
      </ul>
    </aside>

    <div class="container bg-light flex-grow-1 p-3">
      <div class="p-3">
        <p class="text-muted small mb-0">※ 일부 정보는 변경할 수 없습니다.</p>
        <p class="text-muted small mb-1">※ 꼭 변경이 필요한 경우, 관리자에게 문의해주세요.</p>

        <div class="text-center mb-3">
          <label class="form-label fw-bold">프로필사진</label>
          <div>
            <img id="profile-img" :src="previewImage" class="border" style="width: 200px; height: 200px; object-fit: contain;" @click="triggerFileInput"/>
          </div>
          <input class="form-control d-none" type="file" ref="fileInput" accept="image/*" @change="handleFileChange" />
        </div>

        <div class="row g-5 mx-1">
          <div class="col-6">
            <div class="mb-3">
              <label class="form-label fw-bold">별명</label>
              <div class="input-group">
                <input type="text" class="form-control" maxlength="15" />
                <button class="btn btn-outline-secondary" type="button" @click="checkNicknameDuplicate">중복 검사</button>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold">이메일</label>
              <div class="input-group">
                <input type="text" class="form-control" maxlength="15" />
              </div>
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

            <div class="mb-3">
              <label class="form-label fw-bold">자기소개</label>
              <textarea class="form-control" v-model="signupStore.member.bio" maxlength="100" placeholder="100자 이내로 입력하세요." style="resize: none; overflow: hidden;" @input="autoResize"></textarea>
            </div>
          </div>

          <div class="col-6">
            <div class="mb-3">
              <label class="form-label fw-bold">성별</label>
              <div class="input-group">
                <input type="text" class="form-control" maxlength="15" disabled />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold">생일</label>
              <div class="input-group">
                <input type="text" class="form-control" maxlength="15" disabled />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold">가입날짜</label>
              <div class="input-group">
                <input type="text" class="form-control" maxlength="15" disabled />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold">변경날짜</label>
              <div class="input-group">
                <input type="text" class="form-control" maxlength="15" disabled />
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-center gap-3 mt-3">
          <button class="btn btn-secondary" style="max-width: 150px; width: 100%;">취소하기</button>
          <button class="btn btn-dark" style="max-width: 150px; width: 100%;">저장하기</button>
        </div>
      </div>
    </div>
  </div>

  
</template>

<script setup>
  import { ref, watch } from 'vue'
  import { regionData } from '../data/region-data'
  import { useSignupStore } from '../stores/signupStore'

  const signupStore = useSignupStore()

  const fileInput = ref(null)
  const previewImage = ref('/man.png')

  const activeMenu = ref('PROFILE')

  const triggerFileInput = () => {
    fileInput.value?.click()
  }

  const autoResize = (event) => {
    const textarea = event.target
    textarea.style.height = 'auto'
    textarea.style.height = textarea.scrollHeight + 'px'
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        previewImage.value = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }

</script>

<style scoped>
  aside > ul > li:hover {
    color: white;
    background-color: gray;
    cursor: pointer;
  }

  .nav-item.active {
    color: white;
    background-color: black;
  }

  #profile-img {
    transition: opacity 0.3s ease;
    cursor: pointer;
  }

  #profile-img:hover {
    opacity: 0.5;
  }
</style>