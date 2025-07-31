<template>
  <div class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
    <div class="modal-dialog">
      <div class="modal-content" style="max-width: 600px;">
        <div class="modal-header bg-light">
          <h5 class="modal-title">메시지 작성</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>

        <form @submit.prevent="sendMessage">
          <div class="modal-body">
            <div class="mb-3 text-start">
              <label for="study" class="form-label fw-bold">스터디</label>
              <input type="text" class="form-control" v-model="form.study" disabled/>
            </div>

            <div class="mb-3 text-start">
              <label for="sender" class="form-label fw-bold">받는 사람</label>
              <input type="text" class="form-control" v-model="form.receiver" disabled/>
            </div>

            <div class="mb-3 text-start">
              <label for="title" class="form-label fw-bold">제목</label>
              <input type="text" class="form-control" v-model="form.title" maxlength="40" placeholder="40자 이내로 입력하세요."/>
            </div>

            <div class="mb-3 text-start">
              <label for="content" class="form-label fw-bold">내용</label>
              <textarea class="form-control" v-model="form.content" maxlength="255" placeholder="255자 이내로 입력하세요." style="resize: none; overflow: hidden;" @input="autoResize"></textarea>
            </div>
          </div>

          <div class="modal-footer bg-light">
            <button type="submit" class="btn btn-dark mx-auto px-4">전송</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { reactive, defineEmits, onMounted, nextTick } from "vue";
  import messageService from "../api/message-service";
  import { useAlertStore } from "../stores/alertStore";

  const alertStore = useAlertStore();

  const props = defineProps({
    target: String,
    study: String
  })

  const emit = defineEmits(["close"]);

  const form = reactive({
    study: "",
    receiver: "",
    title: "",
    content: "",
  });

  onMounted(() => {
    form.study = props.study;
    form.receiver = props.target;
  })

  // 내용에 맞춰서 입력 필드 높이 조정
  const autoResize = (event) => {
    const textarea = event.target
    
    nextTick(() => {
      textarea.style.height = 'auto'
      textarea.style.height = textarea.scrollHeight + 'px'
    })
  }

  const sendMessage = async () => {
    if (!form.title.trim()) {
      alertStore.showFailedAlert('제목을 입력하지 않았습니다.')
      return
    } if (!form.content.trim()) {
      alertStore.showFailedAlert('내용을 입력하지 않았습니다.')
      return
    }
    
    try {
      const response = await messageService.sendMessage(form);
    } catch (error) {
      alertStore.showFailedAlert(error.response?.data?.message || '오류가 발생했습니다.')
    } finally {
      emit('close');
    }
  }
</script>
