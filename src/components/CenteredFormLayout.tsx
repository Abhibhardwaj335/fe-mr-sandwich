import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const CenteredFormLayout = ({
  title,
  icon,
  children,
  description,
  footer,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  description?: string;
  footer?: React.ReactNode;
}) => {
  return (
      <div className="min-h-screen flex justify-center bg-[#f5f5f5] px-4 pt-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-xl rounded-2xl border border-border bg-[#e3f2fd] text-card-foreground">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center space-x-3">
              {icon && <div className="text-primary text-2xl">{icon}</div>}
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">{title}</h1>
                {description && (
                  <p className="text-muted-foreground text-sm mt-1">{description}</p>
                )}
              </div>
            </div>
            <div>{children}</div>
            {footer && <div className="pt-4 border-t border-border">{footer}</div>}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CenteredFormLayout;