import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {cookies} from "next/headers";
import {Button} from "./ui/button";
import {MoonIcon, SunIcon} from "lucide-react";

interface ThemeTogglerComponentProps {
  initialTheme: "light" | "dark";
}
const ThemeToggler = ({initialTheme}: ThemeTogglerComponentProps) => {
  const [theme, setTheme] = useState<"light" | "dark">(initialTheme);

  useEffect(() => {
    Cookies.set("theme", theme, {expires: 365}); // Save theme for 1 year
    if (document.body && theme == "light") {
      if (document.body.classList.contains("dark")) {
        document.body.classList.remove("dark");
      }
    } else if (document.body) {
      document.body.classList.add("dark");
    }
  }, [theme]);

  // Toggle theme function
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <Button
      className="z-10"
      variant={"outline"}
      size={"icon"}
      onClick={toggleTheme}>
      {theme == "dark" ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
};

export default ThemeToggler;
