
import { SVGProps } from "react";

export const ThumbsRight = (props: SVGProps<SVGSVGElement>) => (
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
    <path d="M17 10V5a3 3 0 0 0-3-3v0a3 3 0 0 0-3 3v5" />
    <path d="M22 10H10a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h2v3a3 3 0 0 0 3 3v0c.64 0 1.23-.25 1.66-.66L19.9 17A2.99 2.99 0 0 0 21 14.33V13" />
    <path d="M22 10a2 2 0 0 0 0-4H11" />
  </svg>
);

export default ThumbsRight;
