<script setup lang="ts">
//工具
import useGlobalProperties from '../../../hooks/useGlobalProperties'
import { onUnmounted, ref } from 'vue'

const Axios = useGlobalProperties("Axios")
interface Banners {
  banners: Array<Banner>
  code: number
}
interface Banner {
  imageUrl: string
  typeTitle: string
  url: string | null
  targetId: number
}
let timer = ref()
const binnerImage = ref()
let slideshowBG = ref('')
let currentSlideshow = ref(-1)
let slideshowList = ref([] as Array<Banner>)
let bannerLength = ref(0)
Axios.get('/banner?type=0').then((data: Banners): void => {
  slideshowList.value = data.banners
  bannerLength.value = slideshowList.value.length
  renderBanner(0)
  currentSlideshow.value = 0
  carousel()
}).catch((reson: string) => {
  throw reson
})
const renderBanner = (i: number): void => {
  binnerImage.value.setAttribute("src", slideshowList.value[i].imageUrl)
  slideshowBG.value = "url('" + slideshowList.value[i].imageUrl + "?imageView&blur=40x20')"
}
const carousel = (): void => {
  timer.value = setInterval(() => {
    currentSlideshow.value = (currentSlideshow.value + 1) % bannerLength.value
    const index = currentSlideshow.value
    renderBanner(index)
  }, 3500)
}
const resetCarousel = (index: number): void => {
  clearInterval(timer.value)
  renderBanner(index)
  currentSlideshow.value = index
  carousel()
}
const previousBanner = () => {
  clearInterval(timer.value)
  const i = currentSlideshow.value
  currentSlideshow.value = i === 0 ? (bannerLength.value - 1) : i - 1
  renderBanner(currentSlideshow.value)
  carousel()
}
const nextBanner = () => {
  clearInterval(timer.value)
  const i = currentSlideshow.value
  currentSlideshow.value = (i + 1) % bannerLength.value
  renderBanner(currentSlideshow.value)
  carousel()
}
const toBanner = () => {
  const currentBanner = slideshowList.value[currentSlideshow.value]
  if (currentBanner.url) {
    window.open(currentBanner.url)
  } else {
    // window.location.href = ""
  }
}
onUnmounted(() => {
  clearInterval(timer.value)
})
</script>

<template>
  <div class="slideshow-bg">
    <div class="slideshow-container relative">
      <div class="slideshow flex">
        <div class="fillHeight">
          <a class="slideshow-image fiilWidth">
            <img class="pointer" ref="binnerImage" @click="toBanner()" />
          </a>
        </div>
        <a @click="previousBanner()" class="previous-slideshow icon pointer"></a>
        <a @click="nextBanner()" class="next-slideshow icon pointer"></a>
        <div class="slideshow-point absolute">
          <a v-for="(item, index) in slideshowList" @click="resetCarousel(index)"
            :class="{ slideshowPointActive: currentSlideshow === index }" :key="item.typeTitle"></a>
        </div>
      </div>
      <div class="download-bg">
        <a class="download-btn pointer"></a>
        <p class="download-intri">PC 安卓 iPhone WP iPad Mac 六大客户端</p>
      </div>
    </div>
  </div>
</template>

<style lang="less">
@img: "../../../assets/img/";

.slideshow-bg {
  background: v-bind(slideshowBG) no-repeat center center;
  background-size: 6000px;
}

.slideshow-container {
  position: relative;
  width: 982px;
  height: 285px;
  margin: 0 auto;
}

.slideshow {
  position: absolute;
  z-index: 10;
  width: 982px;
  height: 285px;

  .icon {
    position: absolute;
    display: block;
    width: 37px;
    height: 63px;
  }
}

.slideshow-image {
  height: 285px;

  img {
    height: 285px;
    width: 730px;
  }
}

.download-bg {
  position: absolute;
  top: 0;
  z-index: 20;
  right: -1px;
  width: 254px;
  height: 285px;
  background: url("@{img}download.png") no-repeat 0 0;
}

.download-btn {
  display: block;
  width: 215px;
  height: 56px;
  margin: 186px 0 0 19px;

  &:hover {
    background: url("@{img}download.png") no-repeat 0 -290px;
  }
}

.download-intri {
  margin: 10px auto;
  text-align: center;
  color: #8d8d8d;
}

.previous-slideshow {
  top: 50%;
  left: -68px;
  margin-top: -31px;
  background: url("@{img}banner.png") no-repeat 0 -360px;
}

.previous-slideshow:hover {
  background: url("@{img}banner.png") no-repeat 0 -430px;
}

.next-slideshow {
  top: 50%;
  right: -68px;
  margin-top: -31px;
  background: url("@{img}banner.png") no-repeat 0 -508px;
}

.next-slideshow:hover {
  background: url("@{img}banner.png") no-repeat 0 -578px;
}

.slideshow-point {
  top: 259px;
  left: 0;
  width: 730px;
  height: 20px;
  text-align: center;

  a {
    display: inline-block;
    width: 20px;
    height: 20px;
    background: url("@{img}banner.png") no-repeat 3px -343px;
    cursor: pointer;

    &:hover {
      background-position: -16px -343px;
    }
  }

  .slideshowPointActive {
    background-position: -16px -343px !important;
  }
}
</style>