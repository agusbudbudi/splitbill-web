"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { toast } from "sonner";
import { Loader2, User, Phone, Wallet } from "lucide-react";

interface PaymentFormProps {
  onSuccess: (paymentData: { paymentId: string; paymentUrl: string }) => void;
}

export default function PaymentForm({ onSuccess }: PaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    amount: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          amount: Number(formData.amount),
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Tagihan berhasil dibuat!");
        onSuccess(result.data);
      } else {
        toast.error(result.error || "Gagal membuat tagihan");
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      toast.error("Terjadi kesalahan yang tidak terduga");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-none rounded-xl overflow-hidden bg-white/80 backdrop-blur-xl mt-4">
      <CardHeader className="text-center pt-8 pb-4">
        <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Buat Tagihan QR</CardTitle>
        <CardDescription className="text-sm font-medium text-slate-500">
          Isi detail di bawah untuk membuat QR pembayaran universal.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-8 px-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5 group">
            <label htmlFor="name" className="text-sm font-bold text-foreground/80 transition-colors group-focus-within:text-primary ml-1">Nama Penerima</label>
            <div className="relative group/input">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within/input:text-primary transition-colors">
                <User className="h-5 w-5" />
              </div>
              <Input
                id="name"
                placeholder="Contoh: Agus"
                className="pl-12 h-14 bg-white border-border/60 hover:border-primary/40 focus-visible:border-primary/60 focus-visible:ring-primary/5 transition-all rounded-2xl font-medium"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5 group">
            <label htmlFor="phone" className="text-sm font-bold text-foreground/80 transition-colors group-focus-within:text-primary ml-1">Nomor HP (GoPay/DANA/ShopeePay)</label>
            <div className="relative group/input">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within/input:text-primary transition-colors">
                <Phone className="h-5 w-5" />
              </div>
              <Input
                id="phone"
                type="tel"
                placeholder="08123456789"
                className="pl-12 h-14 bg-white border-border/60 hover:border-primary/40 focus-visible:border-primary/60 focus-visible:ring-primary/5 transition-all rounded-2xl font-medium"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5 group">
            <label htmlFor="amount" className="text-sm font-bold text-foreground/80 transition-colors group-focus-within:text-primary ml-1">Jumlah Tagihan (Rp)</label>
            <div className="relative group/input">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within/input:text-primary transition-colors">
                <Wallet className="h-5 w-5" />
              </div>
              <Input
                id="amount"
                type="number"
                placeholder="0"
                className="pl-12 h-14 bg-white border-border/60 hover:border-primary/40 focus-visible:border-primary/60 focus-visible:ring-primary/5 transition-all rounded-2xl font-bold text-lg"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 text-lg font-bold hover:scale-[1.01] active:scale-95 transition-all rounded-2xl mt-2" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Memproses...
              </>
            ) : (
              "Generate QR Tagihan"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
