<template>
  <div class="modal fade show d-block" tabindex="-1" v-if="showModal" style="background-color: rgba(0,0,0,0.5);">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content" style="height: 700px;">
        <div class="modal-header bg-light">
          <h5 class="modal-title">메시지 목록</h5>
          <i class="btn_trash fa-solid fa-trash-can" @click="deleteAllMessages" style="position: absolute; left: 124px; top: 24px;" title="모두 삭제"></i>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>

        <div class="modal-body py-1">
          <div v-if="messages.length > 0">
            <div v-for="(message, index) in messages" :key="index" :class="['py-2', index !== messages.length - 1 ? 'border-bottom' : '']">
              <div class="row align-items-center">
                <!-- 프로필 이미지 -->
                <div class="col-auto" style="position: relative;">
                  <img :src="`http://localhost:8080${message.senderProfileImage}`" class="rounded-circle" style="width: 40px; height: 40px; object-fit: cover;"/>
                </div>

                <!-- 보낸 사람 + 스터디 + 제목 + 내용 + 보낸 시간 + 읽음 여부 -->
                <div class="message_body col text-start" @click="showContent(index, message.id)">
                  <div class="d-flex align-items-center justify-content-between">
                    <div class="fw-bold">{{ message.sender }}</div>
                    <div class="text-muted text-truncate" style="font-size: 0.8rem; max-width: 135px;">{{ message.study }}</div>
                  </div>
                  <div class="small mt-1 text-dark">{{ message.title }}</div>
                  <div class="small mt-1 text-secondary px-1" v-if="openedIndex === index">{{ content }}</div>
                  <div class="text-end mt-1 text-muted small">
                    <span style="font-size: 0.8rem;">{{ message.sendDate }}</span>
                    <span v-if="message.isRead"> · <i class="fa-solid fa-eye fa-xs text-muted" title="읽음"></i></span>
                    <span v-if="!message.isRead"> · <i class="fa-solid fa-eye-slash fa-xs text-dark" title="안읽음"></i></span>
                  </div>
                </div>

                <!-- 버튼 -->
                <div class="col-auto text-end px-1">
                  <i class="fas fa-reply btn_reply me-2" @click="$emit('reply', { target : message.sender, study : message.study})" title="답장"></i>
                  <i class="fas fa-trash btn_trash" @click="deleteMessage(message.id)" title="삭제"></i>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="d-flex justify-content-center align-items-center text-muted h-100">수신한 메시지가 없습니다.</div>
        </div>

        <div class="modal-footer bg-light" style="height: 60px;">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import { useAlertStore } from '../stores/alertStore';
  import messageService from '../api/message-service';

  const alertStore = useAlertStore();
  const messages = ref([])
  const openedIndex = ref(-1);
  const content = ref(null);

  const props = defineProps({
    showModal: Boolean
  })

  const emit = defineEmits(['close', 'reply'])

  watch(() => props.showModal, async (newVal) => {
    if (newVal) {
      try {
        const response = await messageService.getMessages();
        messages.value = [...response.data.data];
      } catch (error) {
        alertStore.showFailedAlert(error.response?.data?.message || '오류가 발생했습니다.')
      }
    }
  })

  const showContent = async (index, id) => {
    try {
      const response = await messageService.getMessageDetail(id);
      content.value = response.data.data.content;
      messages.value[index].isRead = true;
    } catch (error) {
      alertStore.showFailedAlert(error.response?.data?.message || '오류가 발생했습니다.')
    } finally {
      if (openedIndex.value === index) {
        openedIndex.value = -1;
      } else {
        openedIndex.value = index;
      }
    }
  }

  const deleteAllMessages = async () => {
    try {
      const response = await messageService.deleteAllMessages();
      messages.value = ref([]);
    } catch (error) {
      alertStore.showFailedAlert(error.response?.data?.message || '오류가 발생했습니다.')
    }
  }

  const deleteMessage = async (id) => {
    try {
      const response = await messageService.deleteMessage(id);
      messages.value = messages.value.filter(m => m.id !== id);
    } catch (error) {
      alertStore.showFailedAlert(error.response?.data?.message || '오류가 발생했습니다.')
    }
  }
</script>

<style>
  .message_body:hover {
    cursor: pointer;
  }

  .btn_trash:hover, .btn_reply:hover {
    cursor: pointer;
    color: #666666;
  }
</style>