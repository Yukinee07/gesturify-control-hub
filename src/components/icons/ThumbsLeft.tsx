
import { SVGProps } from "react";

export const ThumbsLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M7 10V5a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v5" />
    <path d="M2 10h12a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2v3a3 3 0 0 1-3 3v0a2.95 2.95 0 0 1-1.5-.39L4.39 18.2A2.93 2.93 0 0 1 3 15.71V13" />
    <path d="M2 10a2 2 0 0 1 0-4h11" />
  </svg>
);

export default ThumbsLeft;
