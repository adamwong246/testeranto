import SunriseAnimation from './components/SunriseAnimation';
import { useTheme } from './hooks/useTheme';
function App() {
    const { theme } = useTheme();
    return (React.createElement("div", { style: { position: 'relative' } },
        theme === 'daily' && React.createElement(SunriseAnimation, null),
        React.createElement("div", { style: {
                position: 'relative',
                zIndex: 1,
                backgroundColor: 'var(--bs-body-bg)'
            } })));
}
