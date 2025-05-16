import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ComingSoon() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md w-full mx-4">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center">
            Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4 text-md">
            We&apos;re working hard to bring you something amazing. Stay tuned!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}