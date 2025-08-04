<template>
  <div class="container py-4">
    <div class="row g-4">
      <div class="text-end">
        <div id="btn_list" class="text-dark">
          <span @click="showModal = true">
            <i class="fa-solid fa-gear me-1" @click="showModal = true"></i>
            가입 요청 관리
          </span>
        </div>
      </div>

      <StudyJoinRequestPage v-if="showModal" @close="showModal = false" @updated="fetchStudyMembers" />

      <div class="col-md-4" v-for="(member, index) in members" :key="member.nickname">
        <div class="card h-100 shadow-sm">
          <div class="d-flex justify-content-center align-items-center position-relative" style="height: 150px">
            <!-- 왕관 아이콘 -->
            <div class="icon_crown" v-if="member.nickname === manager">
              <i class="fas fa-crown fs-4" :title="'총관리자'" style="color: orange"></i>
            </div>
            <div class="icon_crown" v-if="member.nickname === sub_manager">
              <i class="fas fa-crown fs-4" :title="'부관리자'" style="color: hotpink"></i>
            </div>

            <img :src="`${member.profileImage}`" class="rounded-circle" style="width: 125px; height: 125px; object-fit: cover"/>

            <!-- 점 3개 버튼 -->
            <div id="btn_plus" v-if="member.nickname !== authStore.nickname" @click.stop="toggleMenu(index)">
              <i class="fas fa-ellipsis-vertical fa-lg px-2 py-3"></i>
            </div>

            <!-- 드롭다운 메뉴 -->
            <transition name="dropdown">
              <div v-if="openMenuIndex === index" class="border rounded bg-light" style="position: absolute; top: 40px; right: 20px; z-index: 999" :ref="el => menuRefs[index] = el">
                <div class="menu_item p-2 rounded-top" v-if="authStore.nickname === manager && member.nickname === props.sub_manager" @click="setConfirm(member.memberId, '부관리자에게 총관리자를 위임하시겠습니까?', 'manager')">
                  <i class="fas fa-crown fs-6" :title="'총관리자 위임'" style="color: orange"></i>
                </div>
                <div class="menu_item p-2" v-if="authStore.nickname === manager && member.nickname !== sub_manager" @click="setConfirm(member.memberId, '이 회원을 부관리자로 설정하시겠습니까?', 'subManager')">
                  <i class="fas fa-crown fs-6" :title="'부관리자 설정'" style="color: hotpink"></i>
                </div>
                <div class="menu_item p-2" v-if="authStore.nickname === manager && member.nickname === sub_manager" @click="setConfirm(member.memberId, '이 회원을 부관리자에서 해제하시겠습니까?', 'unset')">
                  <i class="fa-solid fa-user fs-6" :title="'부관리자 해제'" style="color: hotpink; margin-left: 1.5px;"></i>
                </div>
                <div class="menu_item p-2" @click="writeMessage(member.nickname)">
                  <i class="fas fa-paper-plane fs-6" :title="'메시지 보내기'" style="color: blue"></i>
                </div>
                <div class="menu_item p-2 rounded-bottom" v-if="member.nickname !== manager && (authStore.nickname === manager || authStore.nickname === sub_manager)" @click="setConfirm(member.memberId, '이 회원을 스터디에서 내보내시겠습니까?', 'kick')">
                  <i class="fa-solid fa-right-from-bracket fs-6" :title="'내보내기'" style="color: crimson"></i>
                </div>
              </div>
            </transition> 
          </div>

          <div class="card-body px-3 pt-0">
            <p class="card-title text-center mb-0">
              <span class="me-1 fw-bold fs-5">{{ member.nickname }}</span>
              <i :class="{ 'fas fa-mars text-primary': member.gender === '남성', 'fas fa-venus text-danger': member.gender === '여성'}" style="position: relative; top: -1.5px"></i>
            </p>
            <p class="card-text text-center small text-secondary">
              <span>{{ member.birth }}</span> · <span>{{ member.region }}</span>
            </p>
          </div>
          <div class="card-footer text-secondary small text-end">
            {{ member.joinDate }} ~
          </div>

          <!-- 모달 -->
          <div class="modal fade show d-block" tabindex="-1" v-if="isConfirm" style="background-color: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-dialog-scrollable">
              <div class="modal-content">
                <div class="modal-header bg-light">
                  <h5 class="modal-title">확인</h5>
                  <button type="button" class="btn-close" @click="isConfirm = false"></button>
                </div>

                <div class="d-flex modal-body justify-content-center align-items-center" style="min-height: 80px;">
                  <p class="m-0">{{ confirmContent }}</p>
                </div>

                <div class="modal-footer bg-light">
                  <button type="button" class="btn btn-sm btn-dark" @click="setManager(confirmMemberId)" v-if="confirmTarget === 'manager'" style="width: 80px;">예</button>
                  <button type="button" class="btn btn-sm btn-dark" @click="setSubManager(confirmMemberId)" v-if="confirmTarget === 'subManager'" style="width: 80px;">예</button>
                  <button type="button" class="btn btn-sm btn-dark" @click="unsetSubManager" v-if="confirmTarget === 'unset'" style="width: 80px;">예</button>
                  <button type="button" class="btn btn-sm btn-dark" @click="kickMember(confirmMemberId)" v-if="confirmTarget === 'kick'" style="width: 80px;">예</button>
                  <button type="button" class="btn btn-sm btn-secondary" @click="isConfirm = false" style="width: 80px;">아니요</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <MessageWritePage v-if="showWriteModal" :target="selectedTarget" :study="selectedStudy" @close="showWriteModal = false"/>
  </div>
</template>

<script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import StudyJoinRequestPage from './StudyJoinRequestPage.vue';
  import MessageWritePage from '../pages/MessageWritePage.vue'
  import studyService from '../api/study-service';
  import { useRoute } from 'vue-router';
  import { useAlertStore } from '../stores/alertStore';
  import { useAuthStore } from '../stores/authStore';

  const route = useRoute();
  const showModal = ref(false);
  const openMenuIndex = ref(null);
  const menuRefs = ref([]);
  const showWriteModal = ref(false)
  const selectedTarget = ref('');
  const selectedStudy = ref('');
  const members = ref([]);
  const alertStore = useAlertStore();
  const isConfirm = ref(false);
  const confirmMemberId = ref(null);
  const confirmContent = ref('');
  const confirmTarget = ref(null);
  const authStore = useAuthStore();
  const id = route.params.id

  const props = defineProps({
    manager: String,
    sub_manager: String,
    my_role: String,
    study: String,
  });

  const toggleMenu = (index) => {
    openMenuIndex.value = openMenuIndex.value === index ? null : index;
  };

  const handleClickOutside = (event) => {
    const currentRef = menuRefs.value[openMenuIndex.value];
    if (currentRef && !currentRef.contains(event.target)) {
      openMenuIndex.value = null;
    }
  };

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
  });

  const fetchStudyMembers = async () => {
    try {
      const response = await studyService.getStudyMembers(id);
      members.value = [...response.data.data];
    } catch (error) {
      alertStore.showFailedAlert(error.response?.data?.message || '오류가 발생했습니다.')
    }
  }

  onMounted(async () => {
    document.addEventListener('click', handleClickOutside);
    fetchStudyMembers();
  });

  const setConfirm = (memberId, content, target) => {
    confirmMemberId.value = memberId;
    confirmContent.value = content;
    confirmTarget.value = target;
    isConfirm.value = true;
  }

  const setManager = async () => {
    isConfirm.value = false;
    confirmTarget.value = null;
    try {
      const response = await studyService.setManager(id);
      window.location.reload()
    } catch (error) {
      alertStore.showFailedAlert(error.response?.data?.message || '오류가 발생했습니다.')
    }
  }

  const setSubManager = async (memberId) => {
    isConfirm.value = false;
    confirmTarget.value = null;
    try {
      const response = await studyService.setSubManager(id, memberId);
      window.location.reload()
    } catch (error) {
      alertStore.showFailedAlert(error.response?.data?.message || '오류가 발생했습니다.')
    }
  }

  const unsetSubManager = async () => {
    isConfirm.value = false;
    confirmTarget.value = null;
    try {
      const response = await studyService.unsetSubManager(id);
      window.location.reload()
    } catch (error) {
      alertStore.showFailedAlert(error.response?.data?.message || '오류가 발생했습니다.')
    }
  }

  const kickMember = async (memberId) => {
    isConfirm.value = false;
    confirmTarget.value = null;
    try {
      const response = await studyService.kickMember(id, memberId);
      members.value = members.value.filter(m => m.memberId !== memberId);
    } catch (error) {
      alertStore.showFailedAlert(error.response?.data?.message || '오류가 발생했습니다.')
    }
  }

  const writeMessage = (target) => {
    selectedTarget.value = target
    selectedStudy.value = props.study
    showWriteModal.value = true
  }
</script>

<style scoped>
  .dropdown-enter-active, .dropdown-leave-active {
    transition: all 0.2s ease;
  }

  .dropdown-enter-from, .dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }

  .dropdown-enter-to, .dropdown-leave-from {
    opacity: 1;
    transform: translateY(0);
  }

  .menu_item:hover {
    background-color: #aaaaaa;
    color: white;
    cursor: pointer;
  }

  #btn_list:hover > i, #btn_list:hover > span {
    cursor: pointer;
    color: #646464;
  }

  .icon_crown {
    position: absolute;
    top: 0px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  }

  #btn_plus {
    position: absolute;
    top: 10px;
    right: 10px;
    color: #646464;
  }

  #btn_plus:hover {
    cursor: pointer;
    color: black;
  }
</style>
