import { useThemeMode } from '@hooks/useThemeMode'
import ui from '@ui8kit';

export const { Button } = ui.button;
export const { Card, CardHeader, CardContent, CardFooter, CardImage, CardTitle, CardDescription } = ui.card;

function App() {
  const { mode, toggleMode } = useThemeMode();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="w-full max-w-md">
        <CardImage className="rounded-t-md" src="https://images.unsplash.com/vector-1746618662777-7058cb830c6a?q=80&w=1934&auto=format&fit=crop" alt="Theme Mode Switcher" />
          <CardHeader>
            <CardTitle className="text-center !text-3xl font-bold">Theme Mode <span className={`text-primary ${mode === 'utility' ? 'text-primary' : 'text-teal-500'}`}>Switcher</span></CardTitle>
            <p className="text-sm text-secondary-foreground text-center mt-2">See Dev Tools</p>
          </CardHeader>
        <div className="flex flex-col items-center justify-center">
          <CardContent>
            <Button className={`${mode === 'semantic' ? '!bg-teal-500 text-white' : 'bg-primary text-white'}`} variant="default" size="lg" onClick={toggleMode}>
              Switch to {mode === 'utility' ? 'semantic' : 'utility'}
            </Button>
            <p className="text-sm text-secondary-foreground text-center mt-2">Current mode: <span className="font-bold">{mode}</span></p>
          </CardContent>
          <CardFooter>
            <a href="https://github.com/buildy-ui/ui" className="text-sm py-4">buildy/ui</a>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}

export default App 