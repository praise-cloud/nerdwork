import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ComingSoon() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md w-full mx-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">
            We&aspo;re working hard to bring you something amazing. Stay tuned!
          </p>
          <Button variant="outline" disabled>
            Notify Me
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}