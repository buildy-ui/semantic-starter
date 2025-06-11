import { useThemeMode } from '@hooks/useThemeMode'
import dynamicComponents from '@ui8kit';

export const { Button } = dynamicComponents.button;
export const { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } = dynamicComponents.card;

function App() {
  const { mode, toggleMode } = useThemeMode();
  
  return (
    <div>
      <h1>Current mode: {mode}</h1>
      <Button variant="default" size="lg" onClick={toggleMode}>
        Switch to {mode === 'utility' ? 'semantic' : 'utility'}
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}

export default App 