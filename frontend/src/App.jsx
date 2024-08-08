import { useEffect } from "react";
import { Routes, Route, useNavigationType, useLocation } from "react-router-dom";
import AboutUs from "./pages/AboutUs";
import AccountDaDoc from "./pages/AccountDaDoc";
import AccountDangDoc from "./pages/AccountDangDoc";
import AccountFollower from "./pages/AccountFollower";
import AccountHoatDong from "./pages/AccountHoatDong";
import AccountMuonDoc from "./pages/AccountMuonDoc";
import AccountSachDaDocNamNay from "./pages/AccountSachDaDocNamNay";
import AccountThuVien from "./pages/AccountThuVien";
import AccountFollowing from "./pages/AccountFollowing";
import Admin from "./pages/Admin";
import Author from "./pages/Author";
import AuthorPageSpotlight from "./pages/AuthorPageSpotlight";
import DangK from "./pages/DangK";
import DangNhap from "./pages/DangNhap";
import Group from "./pages/Group";
import GroupThanhVien from "./pages/GroupThanhVien";
import GroupThaoLuan from "./pages/GroupThaoLuan";
import GroupYourGroup from "./pages/GroupYourGroup";
import GroupYourGroupAdmin from "./pages/GroupYourGroupAdmin";
import LandingPage from "./pages/Landing";
import Matkhaumoi from "./pages/Matkhaumoi";
import Quenmatkhau from "./pages/Quenmatkhau";
import Sach from "./pages/Sach";
import Searching from "./pages/Searching";
import TiKhonThmThngTin from "./pages/AdminAddAccount";
import TiKhonTtC from "./pages/AdminAllAccount";
import NhmThmThngTin from "./pages/AdminAddGroup";
import NhmTtC from "./pages/AdminAllGroup";
import TcGiThmThngTin from "./pages/AdminAddAuthor";
import TcGiTtC from "./pages/AdminAllAuthor";
import SchThmThngTin from "./pages/AdminAddBook";
import SchTtC from "./pages/AdminAllBook";
import XaGnY from "./pages/AdminDelete";
import XaGnYNhm from "./pages/AdminDeleteGroup";
import XaGnYTiKhon from "./pages/AdminDeleteAccount";
import XaGnYTcGi from "./pages/AdminDeleteAuthor";
import XaGnYSch from "./pages/AdminDeleteBook";
import GroupSuggest from "./pages/GroupSuggest"
import GroupCreate from "./pages/GroupCreate";
function App() {
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (action !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [action, pathname]);

  useEffect(() => {
    let title = "";
    let metaDescription = "";

    switch (pathname) {
      case "/":
        title = "";
        metaDescription = "";
        break;

      case "/authorspotlight":
        title = "";
        metaDescription = "";
        break;

      case "/matkhaumoi":
        title = "";
        metaDescription = "";
        break;

      case "/author":
        title = "";
        metaDescription = "";
        break;

      case "/quenmatkhau":
        title = "";
        metaDescription = "";
        break;

      case "/sach":
        title = "";
        metaDescription = "";
        break;

      case "/dang-nhap":
        title = "";
        metaDescription = "";
        break;

      case "/admin":
        title = "";
        metaDescription = "";
        break;

      case "/groupthaoluan":
        title = "";
        metaDescription = "";
        break;

      case "/groupsuggest":
        title = "";
        metaDescription = "";
        break;

      case "/groupcreate":
        title = "";
        metaDescription = "";
        break;

      case "/groupthanhvien":
        title = "";
        metaDescription = "";
        break;

      case "/groupyourgroupadmin":
        title = "";
        metaDescription = "";
        break;

      case "/groupyourgroup":
        title = "";
        metaDescription = "";
        break;

      case "/group":
        title = "";
        metaDescription = "";
        break;

      case "/accountsachdadocnamnay":
        title = "";
        metaDescription = "";
        break;

      case "/accountfollower":
        title = "";
        metaDescription = "";
        break;

      case "/accountfollowing":
        title = "";
        metaDescription = "";
        break;

      case "/accountdadoc":
        title = "";
        metaDescription = "";
        break;

      case "/accountdangdoc":
        title = "";
        metaDescription = "";
        break;

      case "/accounthoatdong":
        title = "";
        metaDescription = "";
        break;

      case "/accountmuondoc":
        title = "";
        metaDescription = "";
        break;

      case "/accountthuvien":
        title = "";
        metaDescription = "";
        break;

      case "/aboutus":
        title = "";
        metaDescription = "";
        break;

      case "/landing":
        title = "";
        metaDescription = "";
        break;

      case "/timkiem":
        title = "";
        metaDescription = "";
        break;

      case "/DangK":
        title = "";
        metaDescription = "";
        break;

      case "/admindaxoaganday":
        title = "";
        metaDescription = "";
        break;

      case "/admindaxoagandaynhom":
        title = "";
        metaDescription = "";
        break;

      case "/admindaxoagandaytaikhoan":
        title = "";
        metaDescription = "";
        break;

      case "/admindaxoagandaytacgia":
        title = "";
        metaDescription = "";
        break;

      case "/admindaxoagandaysach":
        title = "";
        metaDescription = "";
        break;

      case "/adminaccountadd":
        title = "";
        metaDescription = "";
        break;

      case "/adminaccountall":
        title = "";
        metaDescription = "";
        break;

      case "/admingroupadd":
        title = "";
        metaDescription = "";
        break;

      case "/admingroupall":
        title = "";
        metaDescription = "";
        break;

      case "/adminauthoradd":
        title = "";
        metaDescription = "";
        break;

      case "/adminauthorall":
        title = "";
        metaDescription = "";
        break;

      case "/adminbookadd":
        title = "";
        metaDescription = "";
        break;

      case "/adminbookall":
        title = "";
        metaDescription = "";
        break;

      default:
        title = "";
        metaDescription = "";
        break;
    }

    if (title) {
      document.title = title;
    }

    if (metaDescription) {
      const metaDescriptionTag = document.querySelector('head > meta[name="description"]');
      if (metaDescriptionTag) {
        metaDescriptionTag.content = metaDescription;
      }
    }
  }, [pathname]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/adminaccountadd" element={<TiKhonThmThngTin />} />
      <Route path="/adminaccountall" element={<TiKhonTtC />} />
      <Route path="/admingroupadd" element={<NhmThmThngTin />} />
      <Route path="/admingroupall" element={<NhmTtC />} />
      <Route path="/adminauthoradd" element={<TcGiThmThngTin />} />
      <Route path="/adminauthorall" element={<TcGiTtC />} />
      <Route path="/adminbookadd" element={<SchThmThngTin />} />
      <Route path="/adminbookall" element={<SchTtC />} />
      <Route path="/admindaxoaganday" element={<XaGnY />} />
      <Route path="/admindaxoagandaynhom" element={<XaGnYNhm />} />
      <Route path="/admindaxoagandaytaikhoan" element={<XaGnYTiKhon />} />
      <Route path="/admindaxoagandaytacgia" element={<XaGnYTcGi />} />
      <Route path="/admindaxoagandaysach" element={<XaGnYSch />} />
      <Route path="/authorspotlight/:name" element={<AuthorPageSpotlight />} />
      <Route path="/author/:name" element={<Author />} />
      <Route path="/sach/:name" element={<Sach />} />
      <Route path="/DangK" element={<DangK />} />
      <Route path="/matkhaumoi" element={<Matkhaumoi />} />
      <Route path="/quenmatkhau" element={<Quenmatkhau />} />
      <Route path="/dang-nhap" element={<DangNhap />} />
      <Route path="/groupthaoluan/:userId/:groupName" element={<GroupThaoLuan />} />
      <Route path="/groupsuggest/:userId" element={<GroupSuggest />} />
      <Route path="/groupthanhvien/:userId/:groupName" element={<GroupThanhVien />} />
      <Route path="/groupyourgroupadmin/:userId" element={<GroupYourGroupAdmin />} />
      <Route path="/groupyourgroup/:userId" element={<GroupYourGroup />} />
      <Route path="/group/:userId" element={<Group />} />
      <Route path="/groupcreate/:userId" element={<GroupCreate />} />
      <Route path="/accountsachdadocnamnay/:id" element={<AccountSachDaDocNamNay />} />
      <Route path="/accountfollower/:id" element={<AccountFollower />} />
      <Route path="/accountfollowing/:id" element={<AccountFollowing />} />
      <Route path="/accountdadoc/:id" element={<AccountDaDoc />} />
      <Route path="/accountdangdoc/:id" element={<AccountDangDoc />} />
      <Route path="/accounthoatdong/:id" element={<AccountHoatDong />} />
      <Route path="/accountmuondoc/:id" element={<AccountMuonDoc />} />
      <Route path="/accountthuvien/:id" element={<AccountThuVien />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/timkiem" element={<Searching />} />
    </Routes>
  );
}

export default App;
