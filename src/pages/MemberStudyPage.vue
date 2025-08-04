<template>
  <div class="container p-3" style="max-width: 1102px;">
    <p class="text-muted small mb-0">※ 직접 만든 스터디는 가입한 스터디 목록에서 제외됩니다.</p>  
    <p class="text-muted small mb-3">※ 스터디가 여러 개일 경우, 아래의 스크롤 막대를 좌우로 움직여 확인하세요.</p>  

    <div class="mb-4">
      <div class="d-flex justify-content-between mb-2">
        <span class="fw-bold fs-6 bg-secondary text-white px-2 py-1">내가 만들었어요!</span>
      </div>

      <div class="card-scroll-container d-flex gap-3 px-3 py-1 w-100">
        <div v-if="createList.length === 0" class="mx-auto" style="height: 160px; line-height: 160px;">
          아직 만든 스터디가 없습니다. 스터디를 만들어보세요!
        </div>
        <div class="card-wrapper" v-for="(study, index) in createList" :key="index" @click="showDetail(study.id)">
          <div class="card rounded-3 card-container">
            <div class="card-inner">
                <img class="card-img-top border-bottom" style="width: 310px; height: 200px; object-fit: cover;" :src="`${study.thumbnailImage}`" />
                <div class="card-body py-2">
                  <div class="card-title mb-1 fw-bold text-truncate overflow-hidden text-nowrap">{{ study.title }}</div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class>
      <div class="d-inline-block fw-bold fs-6 mb-2 bg-secondary text-white px-2 py-1">내가 가입했어요!</div>

      <div class="card-scroll-container d-flex gap-3 px-3 py-1 w-100">
        <div v-if="joinList.length === 0" class="mx-auto" style="height: 160px; line-height: 160px;">
          아직 가입한 스터디가 없습니다. 스터디에 가입해보세요!
        </div>
        <div class="card-wrapper" v-for="(study, index) in joinList" :key="index" @click="showDetail(study.id)">
          <div class="card rounded-3 card-container">
            <div class="card-inner">
                <img class="card-img-top border-bottom" style="width: 310px; height: 200px; object-fit: cover;" :src="`${study.thumbnailImage}`" />
                <div class="card-body py-2">
                  <div class="card-title mb-1 fw-bold text-truncate overflow-hidden text-nowrap">{{ study.title }} </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue';
  import studyService from '../api/study-service';
  import { useRouter } from 'vue-router';
  import { useAlertStore } from '../stores/alertStore';

  const createList = ref([]);
  const joinList = ref([]);
  const router = useRouter();
  const alertStore = useAlertStore();

  onMounted(async() => {
    try {
      const response = await studyService.getMyStudies()
      createList.value.push(...(response.data.data.createList || []))
      joinList.value.push(...(response.data.data.joinList || []))
    } catch(error) {
      alertStore.showFailedAlert(error.response?.data?.message || '오류가 발생했습니다.')
    }
  })

  const showDetail = (id) => {
    router.push(`/studies/${id}`)
  }
</script>

<style scoped>
  .card-scroll-container {
    overflow-x: auto;
    flex-wrap: nowrap;
    scrollbar-width: thin;
  }

  .card-wrapper {
    flex: 0 0 auto;
    min-width: 250px;
  }

  .card-container {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .card-container:hover {
    transform: scale(1.02);
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
  }

  .card-inner {
    overflow: hidden;
    min-height: 200px;
    cursor: pointer;
  }

  .btn-create {
    color: #8a8a8a;
    transition: color 0.3s ease;
  }

  .btn-create:hover {
    cursor: pointer;
    color: black;
  }
</style>