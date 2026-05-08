'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { categories } from '@/data/categories';
import { toolsRegistry } from '@/data/tools-registry';
import { CategoryId } from '@/types';

interface NavigationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function getToolCountByCategory(categoryId: CategoryId): number {
  return toolsRegistry.filter((tool) => tool.category === categoryId).length;
}

export default function NavigationSidebar({ isOpen, onClose }: NavigationSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-gray-100 shadow-lg
          transform transition-transform duration-250 ease-out
          md:static md:translate-x-0 md:z-auto md:shadow-none md:w-64
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        aria-label="Category navigation"
      >
        <div className="p-5 pt-16 md:pt-5 overflow-y-auto h-full">
          <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4 px-3">
            Categories
          </h2>
          <nav>
            <ul className="space-y-1">
              {categories.map((category) => {
                const toolCount = getToolCountByCategory(category.id);
                const isActive = pathname === `/${category.slug}` || pathname.startsWith(`/${category.slug}/`);

                return (
                  <li key={category.id}>
                    <Link
                      href={`/${category.slug}`}
                      onClick={onClose}
                      className={`
                        flex items-center justify-between px-3 py-2.5 rounded-lg text-sm
                        transition-all duration-150 min-h-[44px]
                        ${isActive
                          ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-lg" aria-hidden="true">{category.icon}</span>
                        <span>{category.name}</span>
                      </span>
                      <span
                        className={`
                          text-[11px] font-semibold px-2 py-0.5 rounded-full
                          ${isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}
                        `}
                        aria-label={`${toolCount} tools`}
                      >
                        {toolCount}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
