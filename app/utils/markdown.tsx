/**
 * 간단한 마크다운 렌더링 유틸리티
 * AI 응답에서 사용되는 기본적인 마크다운 형식을 HTML로 변환
 */

/**
 * HTML 특수 문자를 이스케이프하여 XSS 방지
 * SSR 호환을 위해 document 대신 수동 이스케이프 사용
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * 마크다운 텍스트를 HTML로 변환
 * 지원 형식:
 * - **bold** → <strong>bold</strong>
 * - *italic* → <em>italic</em>
 * - - 리스트 → <ul><li>리스트</li></ul>
 * - 1. 번호 리스트 → <ol><li>번호 리스트</li></ol>
 * - \n → <br>
 */
export function renderMarkdown(text: string): string {
  if (!text) return '';

  // 먼저 HTML 특수문자 이스케이프
  let html = escapeHtml(text);

  // **bold** 변환
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // *italic* 변환 (이미 bold로 처리되지 않은 것만)
  html = html.replace(/\*([^*]+?)\*/g, '<em>$1</em>');

  // 번호 리스트 변환 (1. 2. 3. ...)
  html = html.replace(/(?:^|\n)(\d+\.\s+.+?)(?=\n\d+\.\s+|\n\n|$)/g, (match) => {
    const items = match.trim().split(/\n(?=\d+\.\s+)/);
    const listItems = items
      .map(item => item.replace(/^\d+\.\s+/, ''))
      .map(item => `<li>${item}</li>`)
      .join('');
    return `<ol class="list-decimal ml-4 my-2 space-y-1">${listItems}</ol>`;
  });

  // 불릿 리스트 변환 (- 또는 * 시작)
  html = html.replace(/(?:^|\n)([-*]\s+.+?)(?=\n[-*]\s+|\n\n|$)/g, (match) => {
    const items = match.trim().split(/\n(?=[-*]\s+)/);
    const listItems = items
      .map(item => item.replace(/^[-*]\s+/, ''))
      .map(item => `<li>${item}</li>`)
      .join('');
    return `<ul class="list-disc ml-4 my-2 space-y-1">${listItems}</ul>`;
  });

  // 줄바꿈 변환
  html = html.replace(/\n/g, '<br>');

  return html;
}

/**
 * React 컴포넌트에서 안전하게 마크다운을 렌더링하기 위한 props 생성
 */
export function getMarkdownProps(text: string) {
  return {
    dangerouslySetInnerHTML: { __html: renderMarkdown(text) }
  };
}
