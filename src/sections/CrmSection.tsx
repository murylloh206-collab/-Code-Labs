import React, { useRef, useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { C, clamp, gutter, rem, useBreakpoints, web } from '../theme';
import { Section, T } from '../ui';
import { Reveal } from '../Reveal';

type TabKey = 'vendas' | 'clientes' | 'rotinas';
const TABS: { key: TabKey; label: string }[] = [
  { key: 'vendas', label: 'Organizar vendas' },
  { key: 'clientes', label: 'Conhecer clientes' },
  { key: 'rotinas', label: 'Conectar rotinas' },
];

const SIDEBAR_ITEMS = ['Visão geral', 'Oportunidades', 'Clientes', 'Atividades', 'Relatórios'];

const DEMOS: Record<
  TabKey,
  { title: string; subtitle: string; metrics: [string, string][]; activeSidebar: number }
> = {
  vendas: {
    title: 'Cada oportunidade, no seu lugar.',
    subtitle: 'Acompanhe o próximo passo de cada negociação.',
    metrics: [
      ['Oportunidades', '12'],
      ['Em negociação', 'R$ 24.800'],
      ['Próximas ações', '5'],
    ],
    activeSidebar: 1,
  },
  clientes: {
    title: 'Relacionamentos com contexto.',
    subtitle: 'Histórico, responsável e próxima ação em uma visão.',
    metrics: [
      ['Clientes ativos', '18'],
      ['Retornos previstos', '7'],
      ['Informações', 'Centralizadas'],
    ],
    activeSidebar: 2,
  },
  rotinas: {
    title: 'Informações que seguem o fluxo.',
    subtitle: 'Exemplo de uma rotina conectada ao seu atendimento.',
    metrics: [
      ['Entrada', 'Formulário'],
      ['Organização', 'CRM'],
      ['Próxima ação', 'Atendimento'],
    ],
    activeSidebar: 3,
  },
};

const PIPELINE = [
  {
    head: 'Novo contato',
    count: '04',
    leads: [
      { name: 'Estúdio Aurora', sub: 'Site institucional', tag: 'Primeira conversa' },
      { name: 'Ateliê Forma', sub: 'Loja virtual' },
    ],
  },
  {
    head: 'Proposta',
    count: '05',
    leads: [{ name: 'Verde Café', sub: 'Sistema de gestão', tag: 'Retomar na terça' }],
  },
  {
    head: 'Em negociação',
    count: '03',
    leads: [
      { name: 'Casa Movimento', sub: 'CRM personalizado', tag: 'Reunião agendada' },
      { name: 'Clínica Plena', sub: 'Portal de atendimento' },
    ],
  },
];

const CLIENTS = [
  ['Estúdio Aurora', 'Hoje, 10h30', 'Enviar apresentação'],
  ['Verde Café', 'Ontem, 15h', 'Revisar proposta'],
  ['Casa Movimento', 'Segunda, 9h', 'Reunião de escopo'],
  ['Clínica Plena', 'Terça, 14h', 'Validar requisitos'],
];

const OUTCOMES = [
  ['Uma visão do que importa.', 'Encontre informações sem depender de planilhas espalhadas.'],
  ['Próximos passos claros.', 'Acompanhe negociações e saiba quem precisa de atenção.'],
  ['Espaço para crescer.', 'Planeje integrações e módulos conforme sua operação evolui.'],
];

export function CrmSection() {
  const bp = useBreakpoints();
  const [tab, setTab] = useState<TabKey>('vendas');
  const tabRefs = useRef<Record<TabKey, any>>({ vendas: null, clientes: null, rotinas: null });
  const demo = DEMOS[tab];

  const padV = bp.md ? 70 : bp.lg ? 85 : 110;
  const h2Size = bp.sm ? rem(2.65) : bp.md ? rem(3.3) : clamp(rem(2.5), bp.vw(4.5), rem(4.4));
  const eyebrowSize = bp.sm ? rem(0.65) : rem(0.75);

  const onTabKeyDown = (idx: number) => (e: any) => {
    const k = e?.key;
    if (!k) return;
    let next: number | null = null;
    if (k === 'ArrowRight') next = (idx + 1) % TABS.length;
    else if (k === 'ArrowLeft') next = (idx - 1 + TABS.length) % TABS.length;
    else if (k === 'Home') next = 0;
    else if (k === 'End') next = TABS.length - 1;
    if (next !== null) {
      e.preventDefault?.();
      const key = TABS[next].key;
      setTab(key);
      tabRefs.current[key]?.focus?.();
    }
  };

  return (
    <Section id="crm" style={{ backgroundColor: '#edefe8', paddingVertical: padV, overflow: 'hidden' }}>
      <View style={{ paddingHorizontal: gutter(bp) }}>
        <View style={{ width: '100%', maxWidth: 1320, alignSelf: 'center' }}>
          {/* Intro */}
          <Reveal>
            <View
              style={{
                flexDirection: bp.md ? 'column' : 'row',
                gap: bp.md ? 25 : bp.lg ? 40 : 80,
                alignItems: bp.md ? 'flex-start' : 'flex-end',
              }}
            >
              <View style={!bp.md ? { flex: 1 } : undefined}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <T style={{ color: C.blue, fontSize: rem(1.25), lineHeight: rem(1.25) }}>+</T>
                  <T style={{ color: '#191e16', fontSize: eyebrowSize, letterSpacing: 0.13 * eyebrowSize, fontWeight: '600', textTransform: 'uppercase' }}>
                    CRM, sem complicação
                  </T>
                </View>
                <T
                  role="heading"
                  aria-level={2}
                  style={{
                    color: '#191e16',
                    fontSize: h2Size,
                    lineHeight: h2Size * 1.04,
                    letterSpacing: -0.055 * h2Size,
                    fontWeight: '500',
                    marginTop: 25,
                  }}
                >
                  Seu cliente não pode{'\n'}se perder <T style={{ color: C.blue }}>no caminho.</T>
                </T>
              </View>
              <View style={[!bp.md ? { flex: 1 } : { maxWidth: 550 }, { paddingBottom: 6 }]}>
                <T style={{ color: '#59614f', fontSize: rem(1), lineHeight: rem(1) * 1.65 }}>
                  <T style={{ color: '#242d1e', fontWeight: '600' }}>
                    CRM é o sistema que organiza o relacionamento da sua empresa com os clientes.
                  </T>{' '}
                  Ele reúne contatos, histórico de conversas, propostas e próximas ações em um só lugar.
                </T>
                <T style={{ color: '#59614f', fontSize: rem(1), lineHeight: rem(1) * 1.65, marginTop: 13 }}>
                  Na prática: sua equipe sabe quem atender, o que foi combinado e qual é o próximo passo. E você acompanha as oportunidades com mais clareza.
                </T>
              </View>
            </View>
          </Reveal>

          {/* Tabs */}
          <View
            role="tablist"
            aria-label="Explore a demonstração de CRM"
            style={{
              marginTop: bp.md ? 25 : 40,
              flexDirection: 'row',
              gap: bp.md ? 1 : 6,
              padding: 5,
              backgroundColor: '#dfe3d8',
              alignSelf: bp.sm ? 'stretch' : 'flex-start',
              borderRadius: 7,
              maxWidth: '100%',
            }}
          >
            {TABS.map((t, i) => {
              const selected = tab === t.key;
              return (
                <Pressable
                  key={t.key}
                  ref={(el) => {
                    tabRefs.current[t.key] = el;
                  }}
                  testID={`tab-${t.key}`}
                  role="tab"
                  aria-selected={selected}
                  onPress={() => setTab(t.key)}
                  {...(Platform.OS === 'web'
                    ? ({ onKeyDown: onTabKeyDown(i), tabIndex: selected ? 0 : -1 } as any)
                    : {})}
                  style={{
                    flex: bp.sm ? 1 : undefined,
                    borderRadius: 4,
                    paddingVertical: bp.sm ? 11 : 12,
                    paddingHorizontal: bp.sm ? 8 : bp.md ? 15 : 20,
                    backgroundColor: selected ? '#fff' : 'transparent',
                    alignItems: 'center',
                    ...(selected ? web({ boxShadow: '0 1px 4px #0001' }) : {}),
                  }}
                >
                  <T
                    style={{
                      color: selected ? '#1f2d15' : '#5e6655',
                      fontSize: bp.sm ? rem(0.67) : bp.md ? rem(0.73) : rem(0.8),
                      fontWeight: '600',
                    }}
                  >
                    {t.label}
                  </T>
                </Pressable>
              );
            })}
          </View>

          {/* Demo frame */}
          <Reveal>
            <View
              testID="crm-demo"
              style={{
                flexDirection: bp.sm ? 'column' : 'row',
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#d4d9ca',
                borderRadius: 10,
                marginTop: 22,
                minHeight: bp.sm ? undefined : bp.md ? 400 : 420,
                overflow: 'hidden',
                ...web({ boxShadow: '0 25px 60px #34422213' }),
              }}
            >
              {!bp.sm && (
                <View
                  aria-hidden={true}
                  style={{
                    width: bp.md ? 130 : 175,
                    backgroundColor: '#20291b',
                    paddingVertical: bp.md ? 20 : 26,
                    paddingHorizontal: bp.md ? 10 : 16,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: bp.md ? 5 : 8,
                      paddingHorizontal: 6,
                      paddingBottom: 23,
                      borderBottomWidth: 1,
                      borderBottomColor: '#46503c',
                    }}
                  >
                    <T style={{ color: C.lime, fontSize: rem(1.1), fontWeight: '700' }}>{'<C>'}</T>
                    <T style={{ color: '#fff', fontSize: bp.md ? rem(0.7) : rem(0.9), letterSpacing: -0.05 * rem(0.9) }}>
                      Workspace
                    </T>
                  </View>
                  <View style={{ gap: 5, marginTop: 22 }}>
                    {SIDEBAR_ITEMS.map((item, idx) => {
                      const active = idx === demo.activeSidebar;
                      return (
                        <View
                          key={item}
                          style={{
                            padding: 11,
                            borderRadius: 5,
                            backgroundColor: active ? C.lime : 'transparent',
                          }}
                        >
                          <T style={{ fontSize: rem(0.72), color: active ? '#26331a' : '#a9b49e' }}>{item}</T>
                        </View>
                      );
                    })}
                  </View>
                  <T style={{ fontSize: rem(0.64), marginTop: 100, marginHorizontal: 10, color: '#a4b098', lineHeight: rem(0.64) * 1.7 }}>
                    Sua operação.{'\n'}Do seu jeito.
                  </T>
                </View>
              )}

              {/* Demo content */}
              <View
                testID="crm-panel"
                role="tabpanel"
                style={{
                  flex: 1,
                  paddingVertical: bp.sm ? 20 : bp.md ? 23 : bp.lg ? 25 : 27,
                  paddingHorizontal: bp.sm ? 15 : bp.md ? 17 : bp.lg ? 22 : 30,
                  minWidth: 0,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: bp.sm ? 10 : 15,
                    alignItems: 'center',
                    flexWrap: bp.sm ? 'wrap' : 'nowrap',
                  }}
                >
                  <View style={{ flexShrink: 1 }}>
                    <T
                      role="heading"
                      aria-level={3}
                      style={{
                        color: '#191e16',
                        fontSize: bp.md ? rem(1.25) : rem(1.5),
                        letterSpacing: -0.04 * rem(1.5),
                        fontWeight: '500',
                      }}
                    >
                      {demo.title}
                    </T>
                    <T style={{ fontSize: bp.sm ? rem(0.59) : bp.md ? rem(0.62) : rem(0.7), color: '#7b856e', marginTop: 5 }}>
                      {demo.subtitle}
                    </T>
                  </View>
                  <View
                    style={{
                      backgroundColor: '#eef2e6',
                      borderWidth: 1,
                      borderColor: '#d5dec8',
                      paddingVertical: bp.md ? 6 : 7,
                      paddingHorizontal: bp.md ? 6 : 10,
                      borderRadius: 4,
                    }}
                  >
                    <T style={{ color: '#5c684f', fontSize: bp.sm ? rem(0.49) : bp.md ? rem(0.55) : rem(0.62), ...web({ whiteSpace: 'nowrap' }) }}>
                      AMBIENTE DEMONSTRATIVO
                    </T>
                  </View>
                </View>

                {/* Metrics */}
                <View style={{ flexDirection: 'row', gap: bp.sm ? 6 : bp.md ? 7 : 12, marginVertical: bp.sm ? 19 : 23 }}>
                  {demo.metrics.map(([label, val]) => (
                    <View
                      key={label}
                      style={{
                        flex: 1,
                        borderWidth: 1,
                        borderColor: '#e0e6d8',
                        paddingVertical: bp.sm ? 12 : bp.md ? 11 : 15,
                        paddingHorizontal: bp.sm ? 7 : bp.md ? 11 : 15,
                        borderRadius: 5,
                      }}
                    >
                      <T style={{ color: '#7b856e', fontSize: bp.sm ? rem(0.52) : bp.md ? rem(0.6) : rem(0.65) }}>{label}</T>
                      <T
                        style={{
                          color: '#191e16',
                          marginTop: 7,
                          fontSize: bp.md ? rem(1.15) : rem(1.4),
                          letterSpacing: -0.05 * rem(1.4),
                          fontWeight: '500',
                        }}
                      >
                        {val}
                      </T>
                    </View>
                  ))}
                </View>

                {/* Tab-specific body */}
                {tab === 'vendas' && (
                  <View style={{ flexDirection: 'row', gap: bp.sm ? 6 : bp.md ? 7 : 12 }}>
                    {PIPELINE.map((col) => (
                      <View
                        key={col.head}
                        style={{
                          flex: 1,
                          backgroundColor: '#f3f5ef',
                          padding: bp.sm ? 7 : bp.md ? 8 : 12,
                          borderRadius: 5,
                          minHeight: bp.sm ? 173 : 165,
                        }}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: bp.sm ? 2 : 0 }}>
                          <View
                            style={{
                              width: bp.sm ? 4 : 5,
                              height: bp.sm ? 4 : 5,
                              backgroundColor: C.blue,
                              borderRadius: 3,
                              marginRight: bp.sm ? 2 : 6,
                            }}
                          />
                          <T style={{ color: '#667156', fontSize: bp.sm ? rem(0.53) : rem(0.66) }}>{col.head}</T>
                          <T style={{ color: '#89947b', fontSize: bp.sm ? rem(0.5) : rem(0.6), marginLeft: 'auto' }}>{col.count}</T>
                        </View>
                        {col.leads.map((lead, idx) => (
                          <View
                            key={lead.name}
                            style={{
                              paddingVertical: bp.sm ? 10 : bp.md ? 10 : 12,
                              paddingHorizontal: bp.sm ? 6 : bp.md ? 7 : 10,
                              backgroundColor: '#fff',
                              borderWidth: 1,
                              borderColor: '#dce3d2',
                              borderRadius: 4,
                              marginTop: idx ? 8 : 0,
                              ...web({ boxShadow: '0 2px 2px #1f290c04' }),
                            }}
                          >
                            <T style={{ color: '#191e16', fontWeight: '600', fontSize: bp.sm ? rem(0.55) : bp.md ? rem(0.59) : rem(0.68) }}>
                              {lead.name}
                            </T>
                            <T
                              style={{
                                fontSize: bp.sm ? rem(0.49) : bp.md ? rem(0.55) : rem(0.6),
                                color: '#77836a',
                                marginTop: 5,
                                lineHeight: bp.sm ? rem(0.49) * 1.5 : undefined,
                              }}
                            >
                              {lead.sub}
                            </T>
                            {lead.tag && (
                              <View
                                style={{
                                  alignSelf: 'flex-start',
                                  marginTop: 9,
                                  backgroundColor: '#f1f6e8',
                                  paddingVertical: bp.sm ? 3 : 4,
                                  paddingHorizontal: bp.sm ? 3 : 5,
                                  borderRadius: 3,
                                }}
                              >
                                <T style={{ color: '#657b40', fontSize: bp.sm ? rem(0.48) : rem(0.55) }}>{lead.tag}</T>
                              </View>
                            )}
                          </View>
                        ))}
                      </View>
                    ))}
                  </View>
                )}

                {tab === 'clientes' && (
                  <View style={{ marginTop: 20 }}>
                    <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e9dd' }}>
                      {['CLIENTE', 'ÚLTIMO CONTATO', 'PRÓXIMO PASSO'].map((h) => (
                        <T
                          key={h}
                          style={{
                            flex: 1,
                            paddingVertical: 12,
                            paddingHorizontal: bp.sm ? 3 : 5,
                            fontSize: bp.sm ? rem(0.54) : rem(0.62),
                            color: '#818b74',
                          }}
                        >
                          {h}
                        </T>
                      ))}
                    </View>
                    {CLIENTS.map((row) => (
                      <View key={row[0]} style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e9dd' }}>
                        {row.map((cell, ci) => (
                          <T
                            key={cell}
                            style={{
                              flex: 1,
                              paddingVertical: 12,
                              paddingHorizontal: bp.sm ? 3 : 5,
                              fontSize: bp.sm ? rem(0.59) : rem(0.7),
                              color: ci === 2 ? '#536a34' : '#191e16',
                              fontWeight: ci === 2 ? '600' : '400',
                            }}
                          >
                            {cell}
                          </T>
                        ))}
                      </View>
                    ))}
                  </View>
                )}

                {tab === 'rotinas' && (
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: bp.sm ? 5 : 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: bp.sm ? 175 : 190,
                    }}
                  >
                    {[
                      { icon: '+', text: 'Novo contato\nrecebido no site', last: false },
                      { icon: '<C>', text: 'Oportunidade\norganizada no CRM', last: false },
                      { icon: '✓', text: 'Equipe avisada\npara atender', last: true },
                    ].map((node, idx) => (
                      <React.Fragment key={node.icon}>
                        {idx > 0 && <View style={{ width: bp.sm ? 9 : 20, height: 1, backgroundColor: '#a4b790' }} />}
                        <View
                          style={{
                            flex: 1,
                            backgroundColor: node.last ? C.lime : '#f4f6ef',
                            borderWidth: 1,
                            borderColor: '#d7dfcb',
                            paddingVertical: bp.sm ? 18 : 20,
                            paddingHorizontal: bp.sm ? 6 : 12,
                            borderRadius: 5,
                            alignItems: 'center',
                          }}
                        >
                          <T style={{ fontSize: rem(1.4), color: '#243af3', fontWeight: '700', marginBottom: 13 }}>{node.icon}</T>
                          <T style={{ color: '#191e16', fontSize: bp.sm ? rem(0.62) : rem(0.72), textAlign: 'center' }}>{node.text}</T>
                        </View>
                      </React.Fragment>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </Reveal>

          {/* Note */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 17,
              gap: bp.md ? 20 : 0,
            }}
          >
            <T style={{ fontSize: bp.sm ? rem(0.55) : bp.md ? rem(0.59) : rem(0.68), color: '#718061', lineHeight: bp.sm ? rem(0.55) * 1.5 : undefined }}>
              Demonstração ilustrativa · dados fictícios
            </T>
            <T
              style={{
                fontSize: bp.sm ? rem(0.55) : bp.md ? rem(0.59) : rem(0.68),
                color: '#718061',
                maxWidth: bp.sm ? 110 : undefined,
                textAlign: bp.sm ? 'right' : 'left',
                lineHeight: bp.sm ? rem(0.55) * 1.5 : undefined,
              }}
            >
              O seu sistema é construído para a sua realidade.
            </T>
          </View>

          {/* Outcomes */}
          <View
            style={{
              flexDirection: bp.sm ? 'column' : 'row',
              gap: bp.sm ? 23 : bp.md ? 20 : 35,
              marginTop: bp.sm ? 29 : 40,
            }}
          >
            {OUTCOMES.map(([title, desc]) => (
              <View key={title} style={!bp.sm ? { flex: 1 } : undefined}>
                <T
                  role="heading"
                  aria-level={3}
                  style={{
                    color: '#191e16',
                    fontSize: bp.sm ? rem(1.05) : bp.md ? rem(0.92) : rem(1.1),
                    letterSpacing: -0.025 * rem(1.1),
                    fontWeight: '500',
                  }}
                >
                  <T style={{ color: C.blue }}>+</T>  {title}
                </T>
                <T
                  style={{
                    fontSize: bp.sm ? rem(0.82) : bp.md ? rem(0.75) : rem(0.8),
                    lineHeight: (bp.sm ? rem(0.82) : rem(0.8)) * 1.65,
                    color: '#6c765f',
                    marginTop: 8,
                    marginLeft: bp.sm ? 17 : 0,
                  }}
                >
                  {desc}
                </T>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Section>
  );
}

