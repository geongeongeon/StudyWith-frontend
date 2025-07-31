<template>
  <div class="modal fade show d-block mt-0" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content" style="height: 700px;">
        <div class="modal-header bg-light">
          <h5 class="modal-title">가입 요청 목록</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body py-1">  
          <div v-if="joinRequests.length > 0">
            <div v-for="(request, index) in joinRequests" :key="index" :class="['py-2', index !== joinRequests.length - 1 ? 'border-bottom' : '']">
              <div class="row align-items-center">
                <!-- 프로필 이미지 -->
                <div class="col-auto">
                  <img :src="`http://localhost:8080${request.profileImage}`" class="rounded-circle" style="width: 40px; height: 40px; object-fit: cover;" />
                </div>

                <!-- 닉네임 + 정보 -->
                <div class="col">
                  <strong>{{ request.nickname }}</strong>
                  <div class="text-muted small">
                    {{ request.region }} · {{ request.gender }} · {{ request.birth }}
                  </div>
                  <div class="text-secondary small">{{ request.bio }}</div>
                </div>

                <!-- 버튼 -->
                <div class="col-auto text-end px-1">
                  <button class="btn btn-sm btn-dark me-1" @click="acceptJoinRequest(request.memberId)"><i class="fa-solid fa-check text-white" style="width: 15px;"></i></button>
                  <button class="btn btn-sm btn-secondary" @click="declineJoinRequest(request.memberId)"><i class="fa-solid fa-xmark text-white" style="width: 15px;"></i></button>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="d-flex justify-content-center align-items-center text-muted h-100">가입 요청이 없습니다.</div>
        </div>
        <div class="modal-footer bg-light" style="height: 60px;">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { defineEmits, onMounted, ref } from 'vue'
  import studyService from '../api/study-service'
  import { useRoute } from 'vue-router'
  import { useAlertStore } from '../stores/alertStore'

  const emit = defineEmits(['close', 'updated'])
  const route = useRoute();
  const id = route.params.id;
  const alertStore = useAlertStore();
  const joinRequests = ref([]);

  const closeModal = () => {
    emit('close')
    emit('updated')
  }

  onMounted(async () => {
    try {
      const response = await studyService.getRequests(id);
      joinRequests.value = [...response.data.data];
    } catch (error) {
      alertStore.showFailedAlert(error.response?.data?.message || '오류가 발생했습니다.')
    }
  })

  const acceptJoinRequest = async (memberId) => {
    try {
      const response = await studyService.acceptJoinRequest(id, memberId);
      joinRequests.value = joinRequests.value.filter(r => r.memberId !== memberId);
    } catch (error) {
      alertStore.showFailedAlert(error.response?.data?.message || '오류가 발생했습니다.')
    }
  }
  
  const declineJoinRequest = async (memberId) => {
    try {
      const response = await studyService.declineJoinRequest(id, memberId);
      joinRequests.value = joinRequests.value.filter(r => r.memberId !== memberId);
    } catch (error) {
      aalertStore.showFailedAlert(error.response?.data?.message || '오류가 발생했습니다.')
    }
  }
</script>
