import { CapsuleSvg } from "../capsuleIcon";

export function OpenIcon() {
  return (
    <CapsuleSvg className="size-7">
      <rect x="3" y="4.5" width="18" height="5" rx="2.5" />
      <rect x="3" y="14.5" width="18" height="5" rx="2.5" />
    </CapsuleSvg>
  );
}

export function CloseIcon() {
  return (
    <CapsuleSvg className="size-7">
      <rect x="2" y="9.5" width="20" height="5" rx="2.5" transform="rotate(45 12 12)" />
      <rect x="2" y="9.5" width="20" height="5" rx="2.5" transform="rotate(-45 12 12)" />
    </CapsuleSvg>
  );
}
