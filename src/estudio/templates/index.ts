import type React from 'react';
import Consultoria, { css as cssConsultoria } from './Consultoria';
import Delivery, { css as cssDelivery } from './Delivery';
import Produto, { css as cssProduto } from './Produto';
import Moda, { css as cssModa } from './Moda';
import Painel, { css as cssPainel } from './Painel';
import type { TplProps, TypeId } from './kit';

export type Template = {
  id: string;
  type: TypeId;
  name: string;
  desc: string;
  Comp: React.ComponentType<TplProps>;
  css: string;
  /** Cor sugerida quando o cliente ainda não escolheu nenhuma. */
  color: string;
};

export const TYPES: { id: TypeId; label: string; desc: string; icon: string }[] = [
  { id: 'site', label: 'Site institucional', desc: 'Apresenta a empresa, os serviços e leva o cliente para o contato.', icon: 'home' },
  { id: 'landing', label: 'Landing page', desc: 'Uma página só, focada em vender um produto ou uma campanha.', icon: 'bolt' },
  { id: 'cardapio', label: 'Cardápio e delivery', desc: 'Pratos com foto e preço, e o pedido chega pronto no WhatsApp.', icon: 'cart' },
  { id: 'loja', label: 'Loja online', desc: 'Vitrine de produtos com categorias, tamanhos e sacola.', icon: 'bag' },
  { id: 'sistema', label: 'Sistema / CRM', desc: 'Painel para organizar clientes, pedidos e agenda.', icon: 'chart' },
];

export const TEMPLATES: Template[] = [
  { id: 'consultoria', type: 'site', name: 'Profissional', desc: 'Moderno e confiável, para empresas de serviço.', Comp: Consultoria, css: cssConsultoria, color: '#c6ff34' },
  { id: 'produto', type: 'landing', name: 'Vitrine de produto', desc: 'Visual limpo e impactante para vender um produto.', Comp: Produto, css: cssProduto, color: '#7e3bed' },
  { id: 'delivery', type: 'cardapio', name: 'Sabor', desc: 'Divertido e apetitoso, com carrinho e categorias.', Comp: Delivery, css: cssDelivery, color: '#ff8a1f' },
  { id: 'moda', type: 'loja', name: 'Coleção', desc: 'Estilo de loja de moda, com sacola e favoritos.', Comp: Moda, css: cssModa, color: '#1f6f78' },
  { id: 'painel', type: 'sistema', name: 'Gestão', desc: 'Painel claro com agenda, metas e clientes.', Comp: Painel, css: cssPainel, color: '#f5b900' },
];

export const byId = (id: string) => TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];
export const forType = (type: TypeId) => TEMPLATES.filter((t) => t.type === type);
