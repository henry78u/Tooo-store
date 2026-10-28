import React, { useState } from 'react';
import { PageHeader } from '../../../components/admin/ui/PageHeader';
import { useAdminStore } from '../../../store/useAdminStore';
import { Send, CheckCircle2 } from 'lucide-react';
import { SupportMessage } from '../../../types/admin';

export default function MessagesPage() {
  const { supportMessages, replyToMessage, updateMessageStatus } = useAdminStore();
  const [selectedTicketId, setSelectedTicketId] = useState<string>(supportMessages[0]?.id || '');
  const [replyText, setReplyText] = useState('');

  const selectedTicket = supportMessages.find((t: SupportMessage) => t.id === selectedTicketId) || supportMessages[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    replyToMessage(selectedTicket.id, replyText.trim());
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support & Concierge Inquiries"
        subtitle="Concierge inquiries, garment sizing consultations, and customer service conversations"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Support', href: '/admin/support/messages' },
          { label: 'Messages' },
        ]}
      />

      <div className="bg-white border border-[#E9E7E3] grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* Left Column: Ticket List */}
        <div className="md:col-span-5 border-r border-[#E9E7E3] divide-y divide-[#E9E7E3] overflow-y-auto">
          <div className="p-3 bg-[#F6F3ED]/40 text-xs font-mono uppercase tracking-wider text-[#77746F] flex items-center justify-between">
            <span>Client Inquiries ({supportMessages.length})</span>
            <span className="text-[10px] bg-[#171717] text-white px-2 py-0.5">Live Desk</span>
          </div>

          {supportMessages.map((ticket: SupportMessage) => {
            const isSelected = ticket.id === selectedTicket?.id;
            return (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicketId(ticket.id)}
                className={`p-4 cursor-pointer transition-colors ${
                  isSelected ? 'bg-[#F6F3ED]' : 'hover:bg-[#F6F3ED]/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-[#171717]">{ticket.customerName}</span>
                  <span className="text-[10px] font-mono text-[#77746F]">
                    {new Date(ticket.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs font-medium text-[#8A4735] mt-1">{ticket.subject}</p>
                <p className="text-xs text-[#77746F] mt-1 line-clamp-2">{ticket.lastMessage}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`text-[10px] font-mono uppercase px-1.5 py-0.5 ${
                      ticket.status === 'Open' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {ticket.status}
                  </span>
                  <span className="text-[10px] font-mono text-[#77746F]">{ticket.customerEmail}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Conversation Stream & Reply Box */}
        <div className="md:col-span-7 flex flex-col justify-between">
          {selectedTicket ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-[#E9E7E3] flex items-center justify-between bg-[#F6F3ED]/20">
                <div>
                  <h3 className="font-medium text-sm text-[#171717]">{selectedTicket.subject}</h3>
                  <p className="text-xs text-[#77746F]">
                    From: {selectedTicket.customerName} &bull; {selectedTicket.customerEmail}
                  </p>
                </div>
                {selectedTicket.status !== 'Resolved' && (
                  <button
                    onClick={() => updateMessageStatus(selectedTicket.id, 'Resolved')}
                    className="text-xs px-3 py-1 bg-white border border-[#E9E7E3] hover:border-[#171717] font-mono uppercase text-[#171717] transition-colors inline-flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Mark Resolved
                  </button>
                )}
              </div>

              {/* Chat Thread */}
              <div className="p-5 space-y-4 overflow-y-auto flex-1 max-h-[380px]">
                {selectedTicket.thread.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 items-start ${
                      msg.sender === 'staff' ? 'flex-row-reverse text-right' : ''
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono shrink-0 ${
                        msg.sender === 'staff' ? 'bg-[#8A4735] text-white' : 'bg-[#171717] text-white'
                      }`}
                    >
                      {msg.sender === 'staff' ? 'T' : selectedTicket.customerName[0]}
                    </div>
                    <div
                      className={`p-3.5 max-w-lg ${
                        msg.sender === 'staff' ? 'bg-[#171717] text-white text-left' : 'bg-[#F6F3ED]'
                      }`}
                    >
                      <p className="text-xs leading-relaxed">{msg.text}</p>
                      <span
                        className={`text-[10px] font-mono block mt-1 ${
                          msg.sender === 'staff' ? 'text-stone-300' : 'text-[#77746F]'
                        }`}
                      >
                        {msg.senderName} &bull; {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="p-4 border-t border-[#E9E7E3] bg-white">
                <div className="relative">
                  <textarea
                    rows={3}
                    placeholder="Type client response or advice regarding atelier fit..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full p-3 border border-[#E9E7E3] text-sm focus:outline-none focus:border-[#171717] resize-none"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <button
                      type="button"
                      onClick={() =>
                        setReplyText(
                          'Thank you for contacting TOOO STORE. Our garments feature an intentional relaxed silhouette. Sizing true to your measurements is advised.'
                        )
                      }
                      className="text-[11px] font-mono text-[#77746F] hover:text-[#171717] underline"
                    >
                      Insert Fit Advisory
                    </button>
                    <button
                      type="submit"
                      disabled={!replyText.trim()}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#171717] text-white text-xs font-medium uppercase tracking-wider hover:bg-black disabled:opacity-40 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Send Response
                    </button>
                  </div>
                </div>
              </form>
            </>
          ) : (
            <div className="p-8 text-center text-[#77746F] text-sm">Select an inquiry to view the conversation.</div>
          )}
        </div>
      </div>
    </div>
  );
}
