 // Asegúrate de tener Radix Button instalado
import { Button, Card, Flex } from "@radix-ui/themes";
import Link from "next/link";

const DeniedPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card>
        <Flex direction={"column"} align={"center"}>
        <h1 className="text-2xl font-bold text-red-600">Acceso Denegado</h1>
        <p className="mt-4 text-gray-600">
          Lo sentimos, no tienes los permisos necesarios para acceder a esta página.
        </p>
        <div className="mt-6">
          <Link href="/">
            <Button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
              Volver al inicio
            </Button>
          </Link>
        </div>
        </Flex>
      </Card>
    </div>
  );
};

export default DeniedPage;
