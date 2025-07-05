import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import './ImageCarousel.css';

const images = [
  require('../assets/img1.jpg'),
  require('../assets/img2.jpg'),
  require('../assets/img3.jpg'),
  require('../assets/img4.jpg'),
  require('../assets/img5.jpg'),
];

const ImageCarousel: React.FC = () => (
  <div className="carousel-container">
    <Swiper
      modules={[Autoplay]}
      spaceBetween={0}
      slidesPerView={1.2}
      loop={true}
      autoplay={{ delay: 0, disableOnInteraction: false }}
      speed={6000}
      allowTouchMove={true}
      grabCursor={true}
      breakpoints={{
        600: { slidesPerView: 2 },
        900: { slidesPerView: 3 },
        1200: { slidesPerView: 4 },
      }}
      style={{ width: '100%', height: '100%' }}
    >
      {images.map((img, idx) => (
        <SwiperSlide key={idx}>
          <img src={img} alt={`Hospital ${idx + 1}`} className="carousel-img" />
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
);

export default ImageCarousel;
