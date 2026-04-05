export const SiteFooter = () => {
  return (
    <footer className="border-t border-stone-200 bg-white/90">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-10 text-sm text-stone-600 md:grid-cols-3">
        <div>
          <h3 className="text-base font-semibold text-stone-900">ExploreX Travel</h3>
          <p className="mt-3 leading-7">
            Nền tảng giới thiệu và đặt tour du lịch nội địa, ưu tiên hành trình miền Tây và các điểm đến nổi bật trong nước.
          </p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-stone-900">Khu vực chính</h3>
          <ul className="mt-3 space-y-2">
            <li>Trang chủ và danh sách tour</li>
            <li>Tài khoản khách hàng và lịch sử đặt tour</li>
            <li>Khu quản trị cho đối tác và admin</li>
          </ul>
        </div>
        <div>
          <h3 className="text-base font-semibold text-stone-900">Trạng thái hiện tại</h3>
          <p className="mt-3 leading-7">
            Public site đã được nối dữ liệu thật từ MySQL. Giai đoạn sau sẽ tiếp tục hoàn thiện form đặt tour và giao diện chi tiết theo file thiết kế.
          </p>
        </div>
      </div>
    </footer>
  );
};
