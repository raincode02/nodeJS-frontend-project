"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Package, FileText, User, Menu, X, Search } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchType, setSearchType] = useState<"product" | "article">(
    "product"
  );

  const navItems = [
    { href: "/", label: "홈", icon: Home },
    { href: "/products", label: "상품", icon: Package },
    { href: "/articles", label: "게시글", icon: FileText },
    { href: "/profile", label: "프로필", icon: User },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchKeyword.trim()) {
      return;
    }

    const trimmedKeyword = searchKeyword.trim();

    if (searchType === "product") {
      router.push(
        `/products?page=1&keyword=${encodeURIComponent(trimmedKeyword)}`
      );
    } else {
      router.push(
        `/articles?page=1&keyword=${encodeURIComponent(trimmedKeyword)}`
      );
    }

    setSearchOpen(false);
    setSearchKeyword("");
  };

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Market</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {/* 검색 버튼 */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="검색"
              >
                <Search size={20} />
              </button>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden border-t py-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* 검색 모달 */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center pt-20 px-4"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">검색</h2>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* 검색 타입 선택 */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setSearchType("product")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  searchType === "product"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                상품 검색
              </button>
              <button
                onClick={() => setSearchType("article")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  searchType === "article"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                게시글 검색
              </button>
            </div>

            {/* 검색 폼 */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder={
                  searchType === "product"
                    ? "상품명, 설명으로 검색..."
                    : "제목, 내용으로 검색..."
                }
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              <button
                type="submit"
                disabled={!searchKeyword.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Search size={20} />
                <span>검색</span>
              </button>
            </form>

            {/* 검색 힌트 */}
            <p className="text-sm text-gray-500 mt-3">
              {searchType === "product"
                ? "상품 이름이나 설명에서 검색합니다"
                : "게시글 제목이나 내용에서 검색합니다"}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
