import { type ComponentProps } from "react";

const iconBase = "stroke-[1.5] fill-none stroke-current";

export function SunIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
      className={`${iconBase} ${props.className}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v1.5m0 15V21m9-9h-1.5M4.5 12H3m15.364-6.364-1.06 1.06M6.696 17.304l-1.06 1.06m12.728 0-1.06-1.06M6.696 6.696l-1.06-1.06M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"
      />
    </svg>
  );
}

export function MoonIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
      className={`${iconBase} ${props.className}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.752 15.002A9.718 9.718 0 0 1 18 15.75 9.75 9.75 0 0 1 8.25 6c0-1.33.266-2.598.748-3.752A9.753 9.753 0 1 0 21.752 15.002Z"
      />
    </svg>
  );
}

export function MenuIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
      className={`${iconBase} ${props.className}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 9h16.5m-16.5 6.75h16.5"
      />
    </svg>
  );
}

export function XMarkIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
      className={`${iconBase} ${props.className}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );
}

export function BellIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
      className={`${iconBase} ${props.className}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
      />
    </svg>
  );
}

export function BriefcaseIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
      className={`${iconBase} ${props.className}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 14.15v4.07a2.25 2.25 0 0 1-2.25 2.25h-12a2.25 2.25 0 0 1-2.25-2.25v-4.07m16.5 0M20.25 14.15V9a2.25 2.25 0 0 0-2.25-2.25h-12A2.25 2.25 0 0 0 3.75 9v5.15m16.5 0v-2.175a2.25 2.25 0 0 0-2.25-2.25h-12a2.25 2.25 0 0 0-2.25 2.25V14.15"
      />
    </svg>
  );
}

export function ChatBubbleLeftRightIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
      className={`${iconBase} ${props.className}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.7-2.038a2.25 2.25 0 0 0-1.581.082l-4.144 2.541a2.25 2.25 0 0 1-2.193-.283L5.61 14.61a2.25 2.25 0 0 1-1.18-1.969V6.63c0-.969.616-1.813 1.5-2.097m14.25 3.985L18 10.5m-3 0h.008v.008H15v-.008ZM12 10.5h.008v.008H12v-.008ZM9 10.5h.008v.008H9v-.008Zm-3 0h.008v.008H15v-.008Zm-3 0h.008v.008H12v-.008Zm-3 0h.008v.008H9v-.008Z"
      />
    </svg>
  );
}

export function CheckIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
      className={`${iconBase} ${props.className}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4.5 12.75 6 6 9-13.5"
      />
    </svg>
  );
}

export function WrenchScrewdriverIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
      className={`${iconBase} ${props.className}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.937l-2.699 3.374c-.318.398-1.013.478-1.423.164l-2.63-2.015c-.41-.314-.297-1.065.13-1.339l2.98-1.914c.95-.611 1.322-1.832 1.26-2.929a4.5 4.5 0 1 1 10.216-.762Z"
      />
    </svg>
  );
}

export function CogIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
      className={`${iconBase} ${props.className}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  );
}

export function CalendarDaysIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
      className={`${iconBase} ${props.className}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12v-.008Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75v-.008Zm0 2.25h.008v.008H9.75v-.008Zm-2.25-2.25h.008v.008H7.5v-.008Zm0 2.25h.008v.008H7.5v-.008Zm-2.25-2.25h.008v.008H5.25v-.008Zm0 2.25h.008v.008H5.25v-.008Zm6.75-2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008v-.008Zm2.25-2.25h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5v-.008Z"
      />
    </svg>
  );
}

export function StarIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
      className={`fill-current stroke-current stroke-[1.5] ${props.className ?? ""}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m12 3 2.78 5.63 6.22.9-4.5 4.39 1.06 6.2L12 17.2l-5.56 2.92 1.06-6.2L3 9.53l6.22-.9L12 3Z"
      />
    </svg>
  );
}

export function BoltIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
      className={`${iconBase} ${props.className ?? ""}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m13 2-8.5 11H11l-1 9 8.5-12H12l1-8Z"
      />
    </svg>
  );
}

export function CheckCircleIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
      className={`${iconBase} ${props.className ?? ""}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
}

export function DocumentTextIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
      className={`${iconBase} ${props.className ?? ""}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375H14.25V6.375A3.375 3.375 0 0 0 10.875 3H8.25m0 12.75h7.5m-7.5 3h4.5m-6.75 3h12a1.5 1.5 0 0 0 1.5-1.5V11.25L11.25 3H6a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 6 21.75Z"
      />
    </svg>
  );
}

export function CameraIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
      className={`${iconBase} ${props.className ?? ""}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.827 6.175A2.31 2.31 0 0 1 9.186 4.5h5.628a2.31 2.31 0 0 1 2.359 1.675l.243.9a.75.75 0 0 0 .724.55H19.5A2.25 2.25 0 0 1 21.75 9.875v7.875A2.25 2.25 0 0 1 19.5 20H4.5a2.25 2.25 0 0 1-2.25-2.25V9.875A2.25 2.25 0 0 1 4.5 7.625h1.36a.75.75 0 0 0 .724-.55l.243-.9ZM15.75 13.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
      />
    </svg>
  );
}

export function ArrowRightIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
      className={`${iconBase} ${props.className ?? ""}`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

export function ArrowUpRightIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
      className={`${iconBase} ${props.className ?? ""}`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function ChevronDownIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
      className={`${iconBase} ${props.className ?? ""}`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function ChevronLeftIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
      className={`${iconBase} ${props.className ?? ""}`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" />
    </svg>
  );
}

export function ChevronRightIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
      className={`${iconBase} ${props.className ?? ""}`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function TrashIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
      className={`${iconBase} ${props.className ?? ""}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m14.74 9-.35 9m-4.78 0L9.26 9m9.97-3.21c.35.05.7.1 1.02.16M19.23 5.79 18.16 19.67A2.25 2.25 0 0 1 15.92 21.75H8.08a2.25 2.25 0 0 1-2.24-2.08L4.77 5.79m14.46 0a48.1 48.1 0 0 0-3.48-.4m-10.98.4c-.35.05-.7.1-1.02.16m1.02-.16a48.1 48.1 0 0 1 3.48-.4m7.5 0V4.47c0-1.18-.91-2.17-2.09-2.21a44.5 44.5 0 0 0-3.32 0 2.18 2.18 0 0 0-2.09 2.21v.92m7.5 0a48.67 48.67 0 0 0-7.5 0"
      />
    </svg>
  );
}

export function DashboardIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" {...props} className={`${iconBase} ${props.className ?? ""}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h6v6H4V4Zm10 0h6v10h-6V4ZM4 14h6v6H4v-6Zm10 4h6v2h-6v-2Z" />
    </svg>
  );
}

export function SearchIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" {...props} className={`${iconBase} ${props.className ?? ""}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m20 20-4.4-4.4m2.4-5.1a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
    </svg>
  );
}

export function UserIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" {...props} className={`${iconBase} ${props.className ?? ""}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 21a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

export function CreditCardIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" {...props} className={`${iconBase} ${props.className ?? ""}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5h18m-16.5-3h15A1.5 1.5 0 0 1 21 6v12a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18V6a1.5 1.5 0 0 1 1.5-1.5ZM6.75 15h3" />
    </svg>
  );
}

export function SlidersIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" {...props} className={`${iconBase} ${props.className ?? ""}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h10m4 0h2M4 12h2m4 0h10M4 18h7m4 0h5M14 4v4M6 10v4m5 2v4" />
    </svg>
  );
}

export function ShieldCheckIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" {...props} className={`${iconBase} ${props.className ?? ""}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 4.5 6v5.25c0 4.64 3.18 8.72 7.5 9.75 4.32-1.03 7.5-5.11 7.5-9.75V6L12 3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.75 12 2.15 2.15 4.35-4.65" />
    </svg>
  );
}

export function FlagIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" {...props} className={`${iconBase} ${props.className ?? ""}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 21V4m0 1h9.25l-.9 2.75L16 10.5H5" />
    </svg>
  );
}

export function InboxIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" {...props} className={`${iconBase} ${props.className ?? ""}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 5.25h15l2.25 9v4.5A2.25 2.25 0 0 1 19.5 21h-15a2.25 2.25 0 0 1-2.25-2.25v-4.5l2.25-9Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 14.25h5.1a2.25 2.25 0 0 0 2.01 1.25h5.28a2.25 2.25 0 0 0 2.01-1.25h5.1" />
    </svg>
  );
}

export function UsersIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" {...props} className={`${iconBase} ${props.className ?? ""}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 21a7.5 7.5 0 0 1 15 0M18 8.25a3 3 0 0 1 0 5.5M20.25 20a5.5 5.5 0 0 0-2.7-4.72" />
    </svg>
  );
}
