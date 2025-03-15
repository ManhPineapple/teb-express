import { Link } from "react-router-dom";

import avatarAnisha from "../../assets/images/avatar-anisha.png";
import avatarAli from "../../assets/images/avatar-ali.png";
import avatarRichard from "../../assets/images/avatar-richard.png";

const Testimonial = () => {
  return (
    <section id="testimonials">
      {/* Container to heading and testm blocks */}
      <div className="max-w-6xl px-5 mx-auto mt-32 text-center">
        {/* Heading */}
        <h2 className="text-4xl font-bold text-center">Đánh giá từ khách hàng</h2>
        {/* Testimonials Container */}
        <div className="flex flex-col mt-24 md:flex-row md:space-x-6">
          {/* Testimonial 1 */}
          <div className="flex flex-col items-center p-6 space-y-6 rounded-lg bg-veryLightGray md:w-1/3">
            <img src={avatarAnisha} className="w-16 -mt-14" alt="" />
            <h5 className="text-lg font-bold">Anisha Li</h5>
            <p className="text-sm text-darkGrayishBlue">
              “Thực sự tuyệt vời! Tìm kiếm thông tin dễ dàng và nhanh chóng. Đội
              ngũ hỗ trợ khách hàng chuyên nghiệp, luôn sẵn sàng giúp đỡ. Cảm
              thấy an tâm và tin tưởng khi sử dụng dịch vụ vận chuyển của
              Ananbay.”
            </p>
          </div>

          {/* Testimonial 2 */}
          <div className="hidden flex-col items-center p-6 space-y-6 rounded-lg bg-veryLightGray md:flex md:w-1/3">
            <img src={avatarAli} className="w-16 -mt-14" alt="" />
            <h5 className="text-lg font-bold">Ali Bravo</h5>
            <p className="text-sm text-darkGrayishBlue">
              “Đơn giản là tuyệt vời! Dễ dàng tìm thấy thông tin về các dịch vụ
              và tùy chọn vận chuyển. Giao diện trực quan và thân thiện, giúp
              mình tiết kiệm thời gian và nỗ lực. Mình sẽ rủ đồng nghiệp dùng
              thử dịch vụ này.”
            </p>
          </div>

          {/* Testimonial 3 */}
          <div className="hidden flex-col items-center p-6 space-y-6 rounded-lg bg-veryLightGray md:flex md:w-1/3">
            <img src={avatarRichard} className="w-16 -mt-14" alt="" />
            <h5 className="text-lg font-bold">Richard Watts</h5>
            <p className="text-sm text-darkGrayishBlue">
              “Trải nghiệm rất tốt nhé!! Web cung cấp đầy đủ thông tin về tuyến
              đường, phí vận chuyển và thời gian giao hàng. Dịch vụ chất lượng
              cao, tư vấn tận tình, không thể hài lòng hơn với sự chuyên nghiệp
              này.”
            </p>
          </div>
        </div>
        {/* Button */}
        <div className="my-16">
          {/* <Link
            to="#"
            className="p-3 px-6 pt-2 text-white bg-brightRed rounded-full baseline hover:bg-brightRedLight"
          >
            Get Started
          </Link> */}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
