<template>
  <div>
    <div class="footer">
      <img :src="qqUrl" alt="qq扫一扫" />
      <ul>
        <li><h2>@Conquer_Solitude</h2></li>
        <li>备案号：不告诉你</li>
      </ul>
      <ul>
        <li><h2>联系我：</h2></li>
        <li>cosolitude@qq.com</li>
        <li>conquersolitude@gmail.com</li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import { IMAGE_BASE_URL } from '@/constants'
const qqUrl = IMAGE_BASE_URL + 'qq.jpg';
console.log(qqUrl)
</script>

<style scoped>
.footer {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #5c4b37 0%, #4a3f2e 50%, #3d3425 100%);
  border-radius: 20px 20px 0 0;
  padding: 40px 30px;
  gap: 40px;
  max-width: 1240px;
  width: 100%;
  margin: 0 auto;
  animation: fadeIn 0.6s ease both;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #667eea, #764ba2, transparent);
  opacity: 0.7;
}

.footer::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(102, 126, 234, 0.08) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 50%, rgba(118, 75, 162, 0.06) 0%, transparent 60%);
  pointer-events: none;
}

.footer img {
  height: 110px;
  width: 110px;
  border-radius: 16px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 2px 8px rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
  object-fit: cover;
}

.footer img:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.4),
    0 4px 12px rgba(0, 0, 0, 0.25);
  border-color: rgba(255, 255, 255, 0.25);
}

.footer ul {
  position: relative;
  z-index: 1;
  padding: 8px 0;
}

.footer ul li {
  list-style: none;
  line-height: 2;
  color: rgba(232, 224, 213, 0.85);
  font-size: 14px;
  letter-spacing: 0.3px;
  transition: color 0.3s ease;
}

.footer ul li:hover {
  color: #e8e0d5;
}

.footer ul li h2 {
  font-size: 18px;
  font-weight: 700;
  color: #e8e0d5;
  letter-spacing: 1.5px;
  margin-bottom: 4px;
  position: relative;
  padding-bottom: 8px;
}

.footer ul li h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 32px;
  height: 2px;
  border-radius: 1px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  opacity: 0.8;
}

.footer ul:nth-child(3) li:not(:first-child) {
  position: relative;
  padding-left: 20px;
}

.footer ul:nth-child(3) li:not(:first-child)::before {
  content: '\2709';
  position: absolute;
  left: 0;
  font-size: 13px;
  color: #a0927e;
  opacity: 0.7;
}

@media (max-width: 900px) {
  .footer {
    flex-direction: column;
    text-align: center;
    gap: 24px;
    padding: 30px 20px;
    border-radius: 16px 16px 0 0;
  }

  .footer img {
    height: 80px;
    width: 80px;
  }

  .footer ul li h2::after {
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
