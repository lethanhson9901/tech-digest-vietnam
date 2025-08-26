import React from 'react';
import MarkdownRenderer from './MarkdownRenderer';

const TestInlineCode = () => {
  const testContent = `
# Test Inline Code Formatting - Loại bỏ Backticks

Đây là một test để kiểm tra inline code formatting với font tiếng Việt và loại bỏ hoàn toàn dấu backticks.

## Test Cases

### 1. Inline Code với dấu backticks
Đây là một ví dụ về \`Claude Code\` được hiển thị inline (không có dấu backticks).

### 2. Multiple Inline Codes
Có thể có nhiều \`code elements\` trong cùng một đoạn văn như \`React\`, \`TypeScript\`, và \`Tailwind CSS\`.

### 3. Code với ký tự đặc biệt và tiếng Việt
Test với \`npm install @types/react\` và \`git commit -m "feat: thêm tính năng mới"\`.

### 4. Code dài với tiếng Việt
Đây là một đoạn code dài: \`const handleSubmit = (event) => { event.preventDefault(); console.log('Form đã được gửi'); }\`.

### 5. Code với emoji và ký tự Unicode
Test với \`🚀 deploy\`, \`📱 mobile\`, và \`🎨 design\`.

### 6. Code với số và ký tự đặc biệt
Test với \`v1.2.3\`, \`API_KEY\`, và \`user@example.com\`.

### 7. Code với nhiều dấu backticks
Test với \`\`\`code\`\`\` và \`\`inline\`\` để đảm bảo tất cả backticks đều bị loại bỏ.

### 8. Code với backticks ở giữa
Test với \`code\`with\`backticks\`inside\` để đảm bảo tất cả backticks đều bị loại bỏ.

## Kết quả mong đợi

- Tất cả các phần tử code phải được hiển thị inline (không xuống dòng mới)
- **KHÔNG hiển thị dấu backticks (\`) trong giao diện**
- Sử dụng font chữ phù hợp với tiếng Việt (JetBrains Mono, Fira Code, etc.)
- Styling đơn giản với background và border
- Phù hợp với cả light theme và dark theme
- Hỗ trợ ligatures và contextual alternates cho font chữ
`;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Test Inline Code Formatting - Loại bỏ Backticks</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <MarkdownRenderer content={testContent} />
      </div>
    </div>
  );
};

export default TestInlineCode;
