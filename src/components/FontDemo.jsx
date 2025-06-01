import React from 'react';

const FontDemo = () => {
  const sampleText = {
    heading: "Công nghệ thông tin và chuyển đổi số tại Việt Nam",
    subheading: "Phát triển bền vững trong kỷ nguyên số",
    paragraph: "Trong bối cảnh cuộc cách mạng công nghiệp 4.0 đang diễn ra mạnh mẽ, Việt Nam đã và đang nỗ lực không ngừng để bắt kịp xu hướng phát triển của thế giới. Việc ứng dụng các công nghệ tiên tiến như trí tuệ nhân tạo (AI), học máy (Machine Learning), Internet vạn vật (IoT), và blockchain đang dần trở thành yếu tố then chốt quyết định sức cạnh tranh của quốc gia.",
    quote: "\"Chuyển đổi số không chỉ là việc áp dụng công nghệ, mà còn là sự thay đổi tư duy và cách thức hoạt động của toàn xã hội.\"",
    list: [
      "Phát triển hạ tầng số quốc gia",
      "Đào tạo nguồn nhân lực chất lượng cao",
      "Xây dựng hệ sinh thái khởi nghiệp sáng tạo",
      "Hoàn thiện khung pháp lý cho chuyển đổi số"
    ]
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 font-sans leading-tight">
          Demo Font Chữ Tiếng Việt
        </h1>
        <p className="text-lg text-gray-600 mb-8 font-sans leading-relaxed">
          Tập hợp các font chữ được tối ưu hóa cho việc đọc tiếng Việt trên web
        </p>

        {/* Inter Font */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-indigo-800 mb-4 font-sans">
            1. Inter Font (Primary)
          </h2>
          <div className="space-y-4 font-sans">
            <h3 className="text-xl font-semibold text-gray-800">
              {sampleText.heading}
            </h3>
            <h4 className="text-lg font-medium text-gray-700">
              {sampleText.subheading}
            </h4>
            <p className="text-vietnamese-body leading-vietnamese tracking-vietnamese text-gray-700">
              {sampleText.paragraph}
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              {sampleText.list.map((item, index) => (
                <li key={index} className="text-vietnamese-body leading-vietnamese tracking-vietnamese text-gray-700">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Noto Sans Font */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-indigo-800 mb-4 font-sans">
            2. Noto Sans (Fallback)
          </h2>
          <div className="space-y-4" style={{ fontFamily: 'Noto Sans, sans-serif' }}>
            <h3 className="text-xl font-semibold text-gray-800">
              {sampleText.heading}
            </h3>
            <h4 className="text-lg font-medium text-gray-700">
              {sampleText.subheading}
            </h4>
            <p className="text-vietnamese-body leading-vietnamese tracking-vietnamese text-gray-700">
              {sampleText.paragraph}
            </p>
          </div>
        </section>

        {/* Noto Serif Font */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-indigo-800 mb-4 font-sans">
            3. Noto Serif (For Quotes & Special Content)
          </h2>
          <div className="space-y-4 font-serif">
            <blockquote className="text-vietnamese-lg leading-vietnamese-relaxed italic text-gray-700 border-l-4 border-indigo-300 pl-6 py-4">
              {sampleText.quote}
            </blockquote>
            <p className="text-lg leading-relaxed text-gray-700">
              {sampleText.paragraph}
            </p>
          </div>
        </section>

        {/* Font Size Comparison */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-indigo-800 mb-4 font-sans">
            4. Font Size Comparison
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h5 className="text-sm font-medium text-gray-500 mb-2">16px (text-base) - Standard</h5>
              <p className="text-base leading-normal font-sans text-gray-700">
                Công nghệ thông tin và chuyển đổi số đang thay đổi cách chúng ta làm việc, học tập và giao tiếp.
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h5 className="text-sm font-medium text-gray-500 mb-2">17px (vietnamese-body) - Optimized</h5>
              <p className="text-vietnamese-body leading-vietnamese tracking-vietnamese font-sans text-gray-700">
                Công nghệ thông tin và chuyển đổi số đang thay đổi cách chúng ta làm việc, học tập và giao tiếp.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h5 className="text-sm font-medium text-gray-500 mb-2">18px (vietnamese-lg) - Large</h5>
              <p className="text-vietnamese-lg leading-vietnamese-relaxed tracking-vietnamese-tight font-sans text-gray-700">
                Công nghệ thông tin và chuyển đổi số đang thay đổi cách chúng ta làm việc, học tập và giao tiếp.
              </p>
            </div>
          </div>
        </section>

        {/* Special Vietnamese Characters */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-indigo-800 mb-4 font-sans">
            5. Vietnamese Diacritics Test
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-vietnamese-body leading-vietnamese tracking-vietnamese font-sans text-gray-700">
                <strong>Tất cả dấu tiếng Việt:</strong> à á ả ã ạ ă ằ ắ ẳ ẵ ặ â ầ ấ ẩ ẫ ậ
              </p>
              <p className="text-vietnamese-body leading-vietnamese tracking-vietnamese font-sans text-gray-700 mt-2">
                <strong>Dấu đặc biệt:</strong> đ ê ề ế ể ễ ệ ô ồ ố ổ ỗ ộ ơ ờ ớ ở ỡ ợ ù ú ủ ũ ụ ư ừ ứ ử ữ ự ỳ ý ỷ ỹ ỵ
              </p>
            </div>
          </div>
        </section>

        {/* Reading Experience Test */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-indigo-800 mb-4 font-sans">
            6. Long-form Reading Test
          </h2>
          <div className="prose prose-vietnamese max-w-none">
            <p className="text-vietnamese-body leading-vietnamese tracking-vietnamese font-sans text-gray-700">
              Việt Nam đang trong giai đoạn chuyển đổi số mạnh mẽ, với mục tiêu trở thành một quốc gia số, xã hội số và kinh tế số vào năm 2030. Quá trình này đòi hỏi sự đầu tư đồng bộ vào hạ tầng công nghệ, phát triển nguồn nhân lực và xây dựng hệ sinh thái khởi nghiệp sáng tạo.
            </p>
            <p className="text-vietnamese-body leading-vietnamese tracking-vietnamese font-sans text-gray-700">
              Các công nghệ mới như trí tuệ nhân tạo, học máy, blockchain và Internet vạn vật đang được ứng dụng rộng rãi trong nhiều lĩnh vực như y tế, giáo dục, nông nghiệp và dịch vụ công. Điều này không chỉ nâng cao hiệu quả hoạt động mà còn tạo ra những cơ hội mới cho phát triển kinh tế.
            </p>
            <p className="text-vietnamese-body leading-vietnamese tracking-vietnamese font-sans text-gray-700">
              Tuy nhiên, để thành công trong chuyển đổi số, Việt Nam cần giải quyết nhiều thách thức như đảm bảo an ninh mạng, bảo vệ dữ liệu cá nhân, thu hẹp khoảng cách số và nâng cao kỹ năng số cho người dân.
            </p>
          </div>
        </section>

        <div className="bg-indigo-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-indigo-800 mb-2 font-sans">
            Kết luận
          </h3>
          <p className="text-vietnamese-body leading-vietnamese tracking-vietnamese font-sans text-indigo-700">
            Font stack được tối ưu với Inter (primary), Noto Sans (fallback), và Noto Serif (cho quotes) 
            cung cấp trải nghiệm đọc tốt nhất cho nội dung tiếng Việt với kích thước 17px và line-height 1.65.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FontDemo; 