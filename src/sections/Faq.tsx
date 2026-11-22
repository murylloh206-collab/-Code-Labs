import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { C, gutter, rem, useBreakpoints } from '../theme';
import { T } from '../ui';

const ITEMS: [string, string][] = [
  [
    'Não sei se preciso de um site ou de um sistema.',
    'Um site apresenta sua empresa e ajuda a gerar contatos. Um sistema organiza processos e permite que pessoas executem tarefas. Você pode precisar de um, do outro ou dos dois conectados. A conversa inicial serve para entender o seu caso.',
  ],
  [
    'Um CRM é só para empresas grandes?',
    'Não. O que conta é a necessidade de acompanhar clientes e oportunidades. Uma equipe pequena também pode se beneficiar. Antes de desenvolver, avaliamos se uma solução sob medida faz sentido para o momento da empresa.',
  ],
  [
    'Quanto custa e quanto tempo leva?',
    'O investimento e o prazo dependem dos objetivos, das telas, das integrações e da complexidade. Depois de entender seu desafio, montamos uma proposta com entregas, condições e cronograma. Não trabalhamos com uma estimativa genérica para todo projeto.',
  ],
  [
    'Posso acompanhar o projeto antes de ficar pronto?',
    'Sim. A proposta define etapas de apresentação e validação para você acompanhar a direção visual e os fluxos principais antes da entrega.',
  ],
  [
    'Vocês integram com ferramentas que já uso?',
    'Avaliamos a documentação e as possibilidades de cada ferramenta. Integrações, migração de dados e automações entram no escopo conforme a viabilidade técnica e as permissões disponíveis.',
  ],
  [
    'E depois que o projeto for entregue?',
    'Hospedagem, manutenção, treinamento e evolução podem ser combinados na proposta. Assim você entende o que está incluído, quais são as responsabilidades e como funciona o acompanhamento.',
  ],
];

export function Faq() {
  const bp = useBreakpoints();
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const padV = bp.md ? 70 : bp.lg ? 85 : 110;
  const h2Size = bp.sm ? rem(2.55) : bp.md ? rem(2.8) : rem(3);
  const eyebrowSize = bp.sm ? rem(0.65) : rem(0.75);

  const toggle = (i: number) => setOpen((o) => ({ ...o, [i]: !o[i] }));

  return (
    <View style={{ paddingVertical: padV }}>
      <View style={{ paddingHorizontal: gutter(bp) }}>
        <View
          style={{
            width: '100%',
            maxWidth: 1320,
            alignSelf: 'center',
            flexDirection: bp.md ? 'column' : 'row',
            gap: bp.md ? 35 : bp.lg ? 60 : 100,
          }}
        >
          <View style={!bp.md ? { flex: 0.8 } : undefined}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <T style={{ color: C.lime, fontSize: rem(1.25), lineHeight: rem(1.25) }}>+</T>
              <T style={{ color: C.paper, fontSize: eyebrowSize, letterSpacing: 0.13 * eyebrowSize, fontWeight: '600', textTransform: 'uppercase' }}>
                Antes de começar
              </T>
            </View>
            <T
              role="heading"
              aria-level={2}
              style={{
                color: C.paper,
                fontSize: h2Size,
                lineHeight: h2Size * 1.08,
                letterSpacing: -0.055 * h2Size,
                fontWeight: '500',
                marginTop: 20,
              }}
            >
              Boas perguntas.{'\n'}Respostas claras.
            </T>
            <T
              style={{
                color: C.muted,
                fontSize: rem(0.85),
                lineHeight: rem(0.85) * 1.65,
                marginTop: 20,
                maxWidth: bp.md ? 420 : 300,
              }}
            >
              Sem precisar entender de tecnologia para dar o primeiro passo.
            </T>
          </View>

          <View style={!bp.md ? { flex: 1.2 } : undefined}>
            {ITEMS.map(([q, a], idx) => {
              const isOpen = !!open[idx];
              return (
                <View
                  key={q}
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: C.line,
                    paddingTop: idx === 0 ? 5 : 23,
                    paddingBottom: 23,
                  }}
                >
                  <Pressable
                    testID={`faq-${idx}`}
                    role="button"
                    aria-expanded={isOpen}
                    onPress={() => toggle(idx)}
                    style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 30 }}
                  >
                    <T
                      style={{
                        color: C.paper,
                        fontSize: bp.sm ? rem(0.86) : rem(1),
                        lineHeight: (bp.sm ? rem(0.86) : rem(1)) * 1.5,
                        flex: 1,
                      }}
                    >
                      {q}
                    </T>
                    <T style={{ color: C.lime, fontSize: rem(1.3), lineHeight: rem(1.3) * 1.2 }}>{isOpen ? '−' : '+'}</T>
                  </Pressable>
                  {isOpen && (
                    <T
                      style={{
                        fontSize: rem(1),
                        lineHeight: rem(1) * 1.65,
                        color: '#9fa993',
                        marginTop: 17,
                        paddingRight: bp.sm ? 12 : 25,
                      }}
                    >
                      {a}
                    </T>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

