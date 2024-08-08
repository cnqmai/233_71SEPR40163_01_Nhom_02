export function formatDate(date) {
  // Kiểm tra nếu date là một đối tượng Date hợp lệ
  const isValidDate = (date instanceof Date) && !isNaN(date);

  // Nếu không phải, chuyển đổi nó thành một đối tượng Date
  const validDate = isValidDate ? date : new Date(date);

  // Kiểm tra lại nếu validDate là một đối tượng Date hợp lệ
  if (isNaN(validDate)) {
    throw new Error('Invalid date');
  }

  const day = validDate.getDate().toString().padStart(2, '0');
  const month = (validDate.getMonth() + 1).toString().padStart(2, '0');
  const year = validDate.getFullYear();
  
  return `${day}-${month}-${year}`;
};

    