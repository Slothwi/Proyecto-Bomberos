import { Icon } from "./Icon";
import { Button } from "./ui";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const lightMode = theme === "light";

  return (
    <Button
      aria-label={lightMode ? "Activar modo oscuro" : "Activar modo claro"}
      className="icon-button theme-toggle"
      onClick={toggleTheme}
      title={lightMode ? "Modo oscuro" : "Modo claro"}
    >
      <Icon name={lightMode ? "moon" : "sun"} />
    </Button>
  );
}
