import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateUsuarioDto } from 'src/usuarios/dto/create-usuario.dto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  public async enviarEmailPontoCriado(caminhoDaFoto: string, nomePonto : string, email: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: 'segurancanamao@gmail.com',
        subject: 'Foi gerado o QRCODE do ponto',
        text: 'Foi gerado o QRCODE do ponto',
        html: '<span>Foi gerado o QRCODE do ponto! Está anexado a este email</span>',
        attachments: [
          {
            filename: `${nomePonto}.png`,
            path: caminhoDaFoto
          }
        ]
      });
    } catch (error) {
      console.log(error)
      throw new BadRequestException(error);
    }
  }

  public async enviarEmailUsuarioCriado({nome, email, senha, email_responsavel}: CreateUsuarioDto): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email_responsavel,
        from: 'segurancanamao@gmail.com',
        subject: `Usuário criado ${nome}`,
        text: 'Usuário criado',
        html: `<div>Usuario: ${nome} - Senha: ${senha}</div>
              <br/>
              <div><strong>Email do usuário ${email}</strong></div>
              `
      })
      return;
    } catch (error) {
      console.log(error)
      throw new BadRequestException('Erro ao enviar o email', { cause: new Error(), description: error });
    }
  }
}
