//components/slider/index.js
import React, { userEffect, useState } from 'react'
import { SliderContainer } from './style'
import "swiper/dist/css/swiper.css"
import Swiper from 'swiper'

function Slider (props) {
  const [sliderSwiper, setSliderSwiper] = useState(null)
  const { bannerList } = props

  userEffect(() => {
    if (bannerList && !sliderSwiper) {
      let sliderSwiper = new Swiper('.slider-container', {
        loop: true,
        autoplay: true,
        autoplayDisableOnInteraction: false,
        pagination: {el:'.swiper-pagination'},
      })
      setSliderSwiper(sliderSwiper)
    }
  }, [bannerList.length, sliderSwiper])

  return (
    <SliderContainer>
      <div className="slider-container">
        <div className="swiper-wrapper">
          {
            bannerList.map(slider => {
              return (
                <div className="swiper-slider" key={slider.imgUrl}>
                  <div></div>
                </div>
              )
            })
          }
        </div>
      </div>
    </SliderContainer>
  )
}