import 'dayjs/locale/pt-br';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { dayjs } from "../lib/dayjs";
import { prisma } from "../lib/prisma";

dayjs.locale('pt-br')
dayjs.extend(localizedFormat)

export async function confirmParticipant (app: FastifyInstance){
  app.withTypeProvider<ZodTypeProvider>().get('/trips/participants/:participantId/confirm', {
    schema: {
      params: z.object ({
        participantId: z.string().uuid()
      })
    }
  }, async (request, reply) => {
    const { participantId } = request.params
    const participant = await prisma.participant.findUnique({where: {id:participantId}})

    if(!participant) {
      throw new Error('Participant not found')
    }

    if (participant.is_confirmed){
      reply.redirect(`http://localhost:3000/trips/${participant.trip_id}`)
    }

    await prisma.participant.update({
      where: {id: participantId},
      data: {is_confirmed: true}
    })

    return reply.redirect(`http://localhost:3000/trips/${participant.trip_id}`)
  })
}