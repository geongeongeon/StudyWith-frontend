<template>
  <transition name="fade">
    <div class="d-block modal fade show" tabindex="-1" role="dialog" style="background-color: rgba(0, 0, 0, 0.5)" v-if="show">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content text-center">
          <div class="modal-header bg-light">
            <h5 class="modal-title">실패</h5>
          </div>
          <div class="modal-body d-flex align-items-center justify-content-center" style="min-height: 80px;">
            <p class="m-0">{{ contant }}</p>
          </div>
          <div class="modal-footer justify-content-center bg-light">
            <button type="button" class="btn btn-secondary" @click="$emit('closeAlert')">확인</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
  defineProps({
    show: Boolean,
    contant: String
  })
</script>

<style scoped>
.modal.fade-enter-active, .modal.fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal.fade-enter, .modal.fade-leave-to {
  opacity: 0;
}

.modal.fade-enter-active {
  animation: fadeIn 0.2s ease-out;
}

.modal.fade-leave-active {
  animation: fadeOut 0.2s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>