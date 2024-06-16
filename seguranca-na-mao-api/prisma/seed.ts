import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


async function main() {
  const empresa = await prisma.empresa.create({
    data: {
      cidade: 'Içara',
      estado: 'SC',
      nome: 'Casa',
      documento: '000000000',
      contato: '48998132453',
      email: 'felipe-daros@hotmail.com',
      endereco: 'Jardim Elizabete',
      responsavel: 'Felipe'
    }
  });

  const posto = await prisma.posto.create({
    data: {
      nome: 'Quarto',
      empresa_id: empresa.id
    }
  });

  await prisma.usuario.create({
    data: {
      email: 'felipe-daros@hotmail.com',
      nome: 'Felipe',
      senha: '123',
      tipo_usuario: 'ADMINISTRADOR',
      isAdmin: true,
      posto_id: posto.id,
      estaLogado: false,
      empresa_id: empresa.id
    }
  })

  console.log(empresa)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })