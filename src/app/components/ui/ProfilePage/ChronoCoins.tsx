"use client";
import React, { useState } from "react";
import { FaCoins } from "react-icons/fa";
import Image from "next/image";
import chronoCoin from "../../../../../public/chronocoin-removebg-preview.png";
import { Button, Modal, Box, Typography, TextField, MenuItem, LinearProgress } from "@mui/material";

interface ChronoCoinsSectionProps {
  chronoCoins: number;
  minWithdrawal: number;
}

export default function ChronoCoinsSection({
  chronoCoins,
  minWithdrawal,
}: ChronoCoinsSectionProps) {
  const [open, setOpen] = useState(false);
  const [pixType, setPixType] = useState("");
  const [pixValue, setPixValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  const handlePixTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPixType(event.target.value);
  };

  const handlePixValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPixValue(event.target.value);
  };

  const handleReceiveCoins = () => {
    if (chronoCoins < minWithdrawal) {
      setError(`O valor mínimo para retirada é de ${minWithdrawal} CC.`);
      return;
    }
    console.log("Tipo PIX:", pixType);
    console.log("Valor PIX:", pixValue);
    console.log("Chrono Coins retirados:", chronoCoins);
    handleClose();
  };

  const progress = (chronoCoins / minWithdrawal) * 100;
  const remainingCoins = minWithdrawal - chronoCoins;

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 300,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  return (
    <section className="mb-6">
      <div className="bg-white p-4 rounded-lg shadow-md flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image
              src={chronoCoin}
              alt="Chrono Coins"
              width={40}
              height={40}
            />
            <div>
              <h2 className="text-lg font-bold text-black">Chrono Coins</h2>
              <p className="text-gray-600">Comissões acumuladas</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-red-600">{chronoCoins} CC</p>
        </div>

        {/* Barra de Progresso */}
        <div className="space-y-2">
          <Typography variant="body2" color="textSecondary">
            Progresso para retirada:
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 10,
              borderRadius: 5,
              "& .MuiLinearProgress-bar": {
                backgroundColor: progress >= 100 ? "#4caf50" : "#f50057",
              },
            }}
          />
          <Typography variant="body2" color="textSecondary">
            Faltam {remainingCoins > 0 ? `${remainingCoins} CC` : "0 CC"} para atingir o mínimo de {minWithdrawal} CC.
          </Typography>
        </div>

        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          disabled={chronoCoins < minWithdrawal}
          fullWidth
          sx={{
            backgroundColor: chronoCoins >= minWithdrawal ? "#4caf50" : "#f50057",
            "&:hover": {
              backgroundColor: chronoCoins >= minWithdrawal ? "#388e3c" : "#c51162",
            },
          }}
        >
          Receber
        </Button>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-receive-title"
        aria-describedby="modal-receive-description"
      >
        <Box sx={style}>
          <Typography id="modal-receive-title" variant="h6" component="h2">
            Receber Chrono Coins
          </Typography>
          <Typography id="modal-receive-description" sx={{ mt: 2 }}>
            Você tem {chronoCoins} Chrono Coins acumulados. Informe os dados abaixo para receber:
          </Typography>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <TextField
            select
            label="Tipo de Chave PIX"
            value={pixType}
            onChange={handlePixTypeChange}
            fullWidth
            sx={{ mt: 2 }}
          >
            <MenuItem value="CPF">CPF</MenuItem>
            <MenuItem value="CNPJ">CNPJ</MenuItem>
            <MenuItem value="E-mail">E-mail</MenuItem>
            <MenuItem value="Telefone">Telefone</MenuItem>
            <MenuItem value="Aleatória">Chave Aleatória</MenuItem>
          </TextField>
          <TextField
            label="Valor da Chave PIX"
            value={pixValue}
            onChange={handlePixValueChange}
            fullWidth
            sx={{ mt: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleReceiveCoins}
          >
            Confirmar Recebimento
          </Button>
        </Box>
      </Modal>
    </section>
  );
}
