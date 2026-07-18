import { footer } from "@/content/site";
import { PaletteSwitcher } from "@/components/PaletteSwitcher";

export function Footer() {
  return (
    <footer className="mt-10 border-t border-hairline">
      <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-3 px-8 py-[26px] font-mono text-[12px] text-faint">
        <span>{footer.left}</span>
        <div className="flex items-center gap-4">
          <PaletteSwitcher />
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
