"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AddButton } from "@/components/ui/AddButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Plus, X, Users } from "lucide-react";
import { useInvoiceStore } from "@/lib/stores/invoiceStore";
import { BilledCard } from "./BilledCard";
import type { BilledEntity } from "@/lib/types/invoice";
import { FormError } from "@/components/ui/FormError";

export function Step2Billed() {
  const {
    billedByList,
    billedToList,
    selectedBilledByIndex,
    selectedBilledToIndex,
    addBilledBy,
    addBilledTo,
    selectBilledBy,
    selectBilledTo,
    removeBilledBy,
    removeBilledTo,
  } = useInvoiceStore();

  const [showByForm, setShowByForm] = useState(false);
  const [showToForm, setShowToForm] = useState(false);

  // Billed By form state
  const [byForm, setByForm] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
  });

  // Billed To form state
  const [toForm, setToForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [byFormErrors, setByFormErrors] = useState<
    Partial<Record<keyof typeof byForm, string>>
  >({});
  const [toFormErrors, setToFormErrors] = useState<
    Partial<Record<keyof typeof toForm, string>>
  >({});

  const handleAddBilledBy = () => {
    const errors: typeof byFormErrors = {};
    if (!byForm.name) errors.name = "Nama harus diisi";
    if (!byForm.phone) errors.phone = "Phone Number harus diisi";
    if (!byForm.email) errors.email = "Email harus diisi";
    if (!byForm.address) errors.address = "Address harus diisi";

    if (Object.keys(errors).length > 0) {
      setByFormErrors(errors);
      return;
    }

    addBilledBy(byForm);
    setByForm({ name: "", address: "", email: "", phone: "" });
    setByFormErrors({});
    setShowByForm(false);
  };

  const handleAddBilledTo = () => {
    const errors: typeof toFormErrors = {};
    if (!toForm.name) errors.name = "Nama harus diisi";
    if (!toForm.phone) errors.phone = "Phone Number harus diisi";

    if (Object.keys(errors).length > 0) {
      setToFormErrors(errors);
      return;
    }

    // @ts-ignore - types need update to support optional email/address for billedTo if strict
    addBilledTo(toForm);
    setToForm({ name: "", phone: "", email: "", address: "" });
    setToFormErrors({});
    setShowToForm(false);
  };

  return (
    <div className="space-y-4">
      {/* Billed By Section */}
      <Card className="p-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground tracking-tight">
              Billed By
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowByForm(!showByForm)}
              className="h-8 rounded-sm"
            >
              {showByForm ? (
                <>
                  <X className="w-3.5 h-3.5 mr-1.5" />
                  Cancel
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 mr-1.5" />
                  Add
                </>
              )}
            </Button>
          </div>

          {/* Add Form */}
          {showByForm && (
            <div className="p-3 bg-muted/30 rounded-xl space-y-2">
              <div>
                <Input
                  placeholder="Nama (e.g., AG Design Official)"
                  value={byForm.name}
                  onChange={(e) => {
                    setByForm({ ...byForm, name: e.target.value });
                    if (byFormErrors.name)
                      setByFormErrors({ ...byFormErrors, name: undefined });
                  }}
                  className={
                    byFormErrors.name
                      ? "border-destructive focus:ring-destructive/20"
                      : ""
                  }
                />
                <FormError message={byFormErrors.name} />
              </div>
              <div>
                <Input
                  type="tel"
                  placeholder="Phone Number (e.g., 08555555555)"
                  value={byForm.phone}
                  onChange={(e) => {
                    setByForm({ ...byForm, phone: e.target.value });
                    if (byFormErrors.phone)
                      setByFormErrors({ ...byFormErrors, phone: undefined });
                  }}
                  className={
                    byFormErrors.phone
                      ? "border-destructive focus:ring-destructive/20"
                      : ""
                  }
                />
                <FormError message={byFormErrors.phone} />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Email (e.g., agdesign@gmail.com)"
                  value={byForm.email}
                  onChange={(e) => {
                    setByForm({ ...byForm, email: e.target.value });
                    if (byFormErrors.email)
                      setByFormErrors({ ...byFormErrors, email: undefined });
                  }}
                  className={
                    byFormErrors.email
                      ? "border-destructive focus:ring-destructive/20"
                      : ""
                  }
                />
                <FormError message={byFormErrors.email} />
              </div>
              <div>
                <Input
                  placeholder="Address (e.g., Jakarta Pusat)"
                  value={byForm.address}
                  onChange={(e) => {
                    setByForm({ ...byForm, address: e.target.value });
                    if (byFormErrors.address)
                      setByFormErrors({ ...byFormErrors, address: undefined });
                  }}
                  className={
                    byFormErrors.address
                      ? "border-destructive focus:ring-destructive/20"
                      : ""
                  }
                />
                <FormError message={byFormErrors.address} />
              </div>
              <AddButton onClick={handleAddBilledBy} label="Simpan Billed By" />
            </div>
          )}

          {/* List */}
          <div className="grid grid-cols-1 gap-3">
            {billedByList.map((entity, index) => (
              <BilledCard
                key={entity.id}
                entity={entity}
                isSelected={selectedBilledByIndex === index}
                onSelect={() => selectBilledBy(index)}
                onRemove={() => removeBilledBy(index)}
                type="by"
              />
            ))}
          </div>

          {billedByList.length === 0 && !showByForm && (
            <EmptyState
              message="Belum ada Billed By"
              subtitle='Klik "Add" untuk menambahkan identitas pengirim invoice.'
              icon={Users}
            />
          )}
        </div>
      </Card>

      {/* Billed To Section */}
      <Card className="p-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground tracking-tight">
              Billed To
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowToForm(!showToForm)}
              className="h-8 rounded-sm"
            >
              {showToForm ? (
                <>
                  <X className="w-3.5 h-3.5 mr-1.5" />
                  Cancel
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 mr-1.5" />
                  Add
                </>
              )}
            </Button>
          </div>

          {/* Add Form */}
          {showToForm && (
            <div className="p-3 bg-muted/30 rounded-xl space-y-2">
              <div>
                <Input
                  placeholder="Nama (e.g., My Indo Kitchen)"
                  value={toForm.name}
                  onChange={(e) => {
                    setToForm({ ...toForm, name: e.target.value });
                    if (toFormErrors.name)
                      setToFormErrors({ ...toFormErrors, name: undefined });
                  }}
                  className={
                    toFormErrors.name
                      ? "border-destructive focus:ring-destructive/20"
                      : ""
                  }
                />
                <FormError message={toFormErrors.name} />
              </div>
              <div>
                <Input
                  type="tel"
                  placeholder="Phone Number (e.g., 08555555555)"
                  value={toForm.phone}
                  onChange={(e) => {
                    setToForm({ ...toForm, phone: e.target.value });
                    if (toFormErrors.phone)
                      setToFormErrors({ ...toFormErrors, phone: undefined });
                  }}
                  className={
                    toFormErrors.phone
                      ? "border-destructive focus:ring-destructive/20"
                      : ""
                  }
                />
                <FormError message={toFormErrors.phone} />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Email (Optional)"
                  value={toForm.email}
                  onChange={(e) => {
                    setToForm({ ...toForm, email: e.target.value });
                    if (toFormErrors.email)
                      setToFormErrors({ ...toFormErrors, email: undefined });
                  }}
                  className={
                    toFormErrors.email
                      ? "border-destructive focus:ring-destructive/20"
                      : ""
                  }
                />
                <FormError message={toFormErrors.email} />
              </div>
              <div>
                <Input
                  placeholder="Address (Optional)"
                  value={toForm.address}
                  onChange={(e) => {
                    setToForm({ ...toForm, address: e.target.value });
                    if (toFormErrors.address)
                      setToFormErrors({ ...toFormErrors, address: undefined });
                  }}
                  className={
                    toFormErrors.address
                      ? "border-destructive focus:ring-destructive/20"
                      : ""
                  }
                />
                <FormError message={toFormErrors.address} />
              </div>
              <AddButton onClick={handleAddBilledTo} label="Simpan Billed To" />
            </div>
          )}

          {/* List */}
          <div className="grid grid-cols-1 gap-3">
            {billedToList.map((entity, index) => (
              <BilledCard
                key={entity.id}
                entity={entity}
                isSelected={selectedBilledToIndex === index}
                onSelect={() => selectBilledTo(index)}
                onRemove={() => removeBilledTo(index)}
                type="to"
              />
            ))}
          </div>

          {billedToList.length === 0 && !showToForm && (
            <EmptyState
              message="Belum ada Billed To"
              subtitle='Klik "Add" untuk menambahkan penerima invoice.'
              icon={Users}
            />
          )}
        </div>
      </Card>
    </div>
  );
}
