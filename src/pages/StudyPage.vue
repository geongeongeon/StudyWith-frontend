<template>
  <div class="container d-flex">
    <aside class="border-end p-3">
      <ul class="nav flex-column">
        <li class="nav-item p-3 mb-1" style="width: 110px;" :class="{ active: activeMenu === 'DETAIL' }" @click="activeMenu = 'DETAIL'">스터디 정보</li>
        <li class="nav-item p-3 mb-1" style="width: 110px;" :class="{ active: activeMenu === 'MEMBER' }" @click="activeMenu = 'MEMBER'">스터디 회원</li>
        <li class="nav-item p-3" style="width: 110px;" :class="{ active: activeMenu === 'DELETE' }" @click="activeMenu = 'DELETE'">스터디 탈퇴</li>
      </ul>
    </aside>

    <div class="bg-light p-3 flex-grow-1" v-if="activeMenu === 'DETAIL'">
      <StudyDetailPage />
    </div>
    <div class="bg-light p-3 flex-grow-1" v-if="activeMenu === 'MEMBER'">
      <StudyMemberPage :manager="study.manager" :sub_manager="study.subManager" :my_role="study.myRole" :study="study.title" />
    </div>
    <div class="bg-light p-3 flex-grow-1" v-if="activeMenu === 'DELETE'">
      <StudyDeletePage :manager="study.manager" :title="study.title" />
    </div>
  </div>
</template>

<script setup>
  import { onMounted, ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import StudyDetailPage from './StudyDetailPage.vue';
  import studyService from '../api/study-service';
  import StudyDeletePage from './StudyDeletePage.vue';
  import StudyMemberPage from './StudyMemberPage.vue';
  import { useAlertStore } from '../stores/alertStore'

  const alertStore = useAlertStore();
  const route = useRoute();
  const activeMenu = ref('DETAIL');
  const study = ref({});

  onMounted(async () => {
    const id = route.params.id
    
    try {
      const response = await studyService.getStudy(id)
      study.value = response.data.data
    } catch (error) {
      alertStore.showFailedAlert(error.response?.data?.message || '오류가 발생했습니다.')
    }
  })

  watch(() => activeMenu.value, (newMenu) => {
    if ((newMenu === 'MEMBER' || newMenu === 'DELETE') && study.value.myRole === 'guest') {
      alertStore.showFailedAlert('스터디의 회원만 접근할 수 있습니다.');
      activeMenu.value = 'DETAIL';
    }
  });
</script>

<style scoped>
  aside > ul > li {
    transition: background-color 0.2s ease;
  }

  aside > ul > li:hover {
    cursor: pointer;
  }

  .nav-item.active {
    color: white;
    background-color: black;
  }
</style>