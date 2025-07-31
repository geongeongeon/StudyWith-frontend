<template>
  <div class="container">
    <div class="p-3">
      <!-- 필터 + 검색바 -->
      <div id="top" class="d-flex align-items-center mb-4 mx-auto" style="max-width: 700px; scroll-margin-top: 80px;">
        <!-- 필터 버튼 -->
        <button class="btn btn-outline-secondary me-3 p-0" style="border-color: #ced4da; width: 38px; height: 38px;" @click="showModal = true">
          <i class="bi bi-filter fs-4"></i>
        </button> 

        <!-- 검색바 -->
        <div class="input-group flex-grow-1">
          <select v-model="selectedFilter" class="form-select" style="max-width:100px; cursor: pointer;">
            <option value="new">NEW</option>
            <option value="hot">HOT</option>
          </select>
          <input class="form-control bg-light" v-model="searchQuery" type="text" placeholder="검색어를 입력하세요." />
          <button class="btn btn-outline-secondary" style="max-width:60px;" @click="searchStudies"><i class="bi bi-search"></i></button>
        </div>

        <!-- 스터디 생성 -->
        <div class="ms-3">
          <span class="btn btn-outline-secondary fw-bold px-2 py-1" style="border-color: #ced4da; height: 38px; line-height: 29px;" @click="createStudy">┼</span>
        </div>
      </div>

      <!-- 필터 모달 -->
      <div v-if="showModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0, 0, 0, 0.5);">
        <div class="modal-dialog p-3">
          <div class="modal-content">
            <div class="modal-header bg-light">
              <h5 class="modal-title">필터</h5>
              <button type="button" class="btn-close" @click="showModal = false"></button>
            </div>
            <div class="modal-body px-4">
              <label class="form-label fw-bold">모집 상태</label>
              <div class="row text-center g-3 mb-2">
                <div class="col-4" v-for="(option, index) in recruitStatusOptions" :key="index">
                  <div class="border rounded-5 p-2 option-box" :class="{ 'active': selectedRecruitStatus === option.value }" @click="selectedRecruitStatus = option.value">
                    {{ option.label }}
                  </div>
                </div>
              </div>

              <!-- <label class="form-label fw-bold mt-2">성별</label>
              <div class="row text-center g-3 mb-4">
                <div class="col-4" v-for="(option, index) in genderOptions" :key="index">
                  <div class="border rounded-5 p-2 option-box" :class="{ 'active': selectedGender === option.value }" @click="selectedGender = option.value">
                    {{ option.label }}
                  </div>
                </div>
              </div> -->

              <!-- <label class="form-label fw-bold mt-2">나이</label>
              <div class="row text-center g-3">
                <div class="col-3" v-for="(option, index) in ageOptions" :key="index">
                  <div class="border rounded-5 p-2 option-box" :class="{ 'active': selectedAge === option.value }" @click="selectedAge = option.value">
                    {{ option.label }}
                  </div>
                </div>
              </div> -->
            </div>
            <div class="modal-footer bg-light">
              <button class="btn btn-secondary" @click="showModal = false">닫기</button>
              <button class="btn btn-dark" @click="applyFilters">적용</button>
            </div>
          </div>
        </div>
      </div>  

      <!-- 카드 목록 -->
      <div class="row g-4 px-3">
        <div class="col-md-4" v-for="(study, item) in studies" :key="item">
          <div class="card rounded-3 card-container" @click="showDetail(study.id)" @mouseenter="onMouseEnter(study)" @mouseleave="onMouseLeave(study)">
            <div class="card-inner h-100">
              <!-- 앞면 -->
              <div class="card-front h-100 w-100" :class="{ 'd-none': study.hover }">
                <span class="badge bg-dark p-2 position-absolute rounded-0 shadow-lg" style="top: 10px; left: 10px; z-index: 10;">{{ study.isRecruit ? '모집중' : '' }}</span>
                <img class="card-img-top border-bottom" style="height: 200px; object-fit: cover;" :src="`http://localhost:8080${study.thumbnailImage}`" />
                <div class="card-body py-2">
                  <div class="card-title mb-1 fw-bold text-truncate overflow-hidden text-nowrap">{{ study.title }}</div>
                  <div class="card-text text-muted text-truncate overflow-hidden text-nowrap">{{ study.region }}</div>
                </div>
              </div>

              <!-- 뒷면 -->
              <div v-if="study.hover" class="card-back h-100 w-100 p-3">
                <div class="card-body">
                  <div class="card-title mb-1 fw-bold fs-5">{{ study.title }}</div>
                  <span class="badge bg-secondary me-1 rounded-5" v-for="(tag, index) in study.tags" :key="index">{{ tag }}</span>
                  <p class="mt-3 text-muted small">{{ study.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 페이지네이션 -->
      <ul class="d-flex justify-content-center align-items-center gap-2 p-0 m-0 mt-4 list-unstyled" id="pagination">
        <li class="px-2 py-2 border rounded btn text-center pagination-item" style="min-width: 40px;" @click="currentPage = 1">‹‹</li>
        <li class="mx-2 text-center" :class="{ 'd-none': visiblePages.includes(1) }"><i class="bi bi-three-dots"></i></li>
        <li class="px-3 py-2 border rounded btn pagination-item" v-for="page in visiblePages" :key="page" :class="{ 'active': currentPage === page }" @click="currentPage = page">{{ page }}</li>
        <li class="mx-2 text-center" :class="{ 'd-none': visiblePages.includes(maxPage) }"><i class="bi bi-three-dots"></i></li>
        <li class="px-2 py-2 border rounded btn text-center pagination-item" style="min-width: 40px;" @click="currentPage = maxPage">››</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, watch, nextTick } from 'vue'
  import studyService from '../api/study-service'
  import { useRouter } from 'vue-router'
import { useAlertStore } from '../stores/alertStore'

  const searchQuery = ref('')
  const selectedFilter = ref('new')
  const showModal = ref(false)
  const selectedRecruitStatus = ref('all')
  const currentPage = ref(1)
  const maxPage = ref(20)
  const router = useRouter()
  const alertStore = useAlertStore();

  const recruitStatusOptions = [
    { value: 'all', label: '전체' },
    { value: 'open', label: '진행중' },
    { value: 'closed', label: '종료' }
  ]

  const studies = ref([])

  const createStudy = () => {
    router.push('/studies/create')
  }

  const showDetail = (id) => {
    router.push(`/studies/${id}`)
  }

  const hoverTimers = new Map();

  const onMouseEnter = (study) => {
    // 0.5초 후에 hover true 설정
    const timer = setTimeout(() => {
      study.hover = true;
    }, 500 );
    hoverTimers.set(study.id, timer);
  }

  const onMouseLeave = (study) => {
    // 타이머 취소하고 hover false 즉시 적용
    const timer = hoverTimers.get(study.id);
    if (timer) {
      clearTimeout(timer);
      hoverTimers.delete(study.id);
    }
    study.hover = false;
  }

  const visiblePages = computed(() => {
    const range = 2 // 현재 페이지 양옆으로 2개씩 보여줌, 총 5개

    let start = currentPage.value - range
    let end = currentPage.value + range

    if (start < 1) {
      end += (1 - start)
      start = 1
    }

    if (end > maxPage.value) {
      start -= (end - maxPage.value)
      end = maxPage.value
    }

    if (start < 1) start = 1

    const pages = []
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return pages
  })

  const fetchData = async (page) => {
    try {
      const recruitFilter = selectedRecruitStatus.value === 'all' ? '' : selectedRecruitStatus.value;

      const response = await studyService.getStudies(page - 1, 9, 'id,desc', selectedFilter.value, searchQuery.value, recruitFilter);
      studies.value = response.data.data.content;
      maxPage.value = response.data.data.totalPages;

      await nextTick();
      const top = document.getElementById('top');
      if (top) top.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      alertStore.showFailedAlert(error.response?.data?.message || '오류가 발생했습니다.')
    }
  };

  const applyFilters = () => {
    currentPage.value = 1;
    showModal.value = false;
  }

  const searchStudies = () => {
    currentPage.value = 1;
    fetchData(currentPage.value);
  };

  watch(currentPage, fetchData, { immediate: true });

  watch(selectedFilter, () => {
    fetchData(currentPage.value);
  });

  watch(selectedRecruitStatus, () => {
    currentPage.value = 1;
    fetchData(currentPage.value);
  });
</script>

<style scoped>
  .card-container {
    position: relative;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .card-container:hover {
    transform: scale(1.02);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.20);
  }

  .card-inner {
    overflow: hidden;
    position: relative;
    min-height: 273px;
    cursor: pointer;
  }

  .card-inner:hover {
    overflow: auto;
  }

  .card-front, .card-back {
    position: absolute;
    top: 0;
    left: 0;
    transition: opacity 0.3s ease;
  }

  .input-group .form-control, .input-group .btn-outline-secondary {
    border-color: #ced4da;
  }

  .option-box {
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease;
    border: 1px solid #ced4da;
  }

  .option-box:hover {
    background-color: #dededf;
  }

  .option-box.active {
    background-color: rgb(65, 65, 65);
    color: white;
    border-color: rgb(65, 65, 65) !important;
    font-weight: 600;
  }

  .pagination-item:hover {
    background-color: #dededf;
  }

  #pagination .active {
    background-color: black !important;
    color: white;
  }
</style>