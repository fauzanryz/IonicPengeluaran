<?php
header("Content-Type: application/json");

// Database configuration
$dbHost = "localhost";
$dbName = "db_pengeluaran";
$dbUser = "root";
$dbPassword = "";


// Create a MySQLi connection
$mysqli = new mysqli($dbHost, $dbUser, $dbPassword, $dbName);

// Check connection
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// Get pengeluaran list
if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $result = $mysqli->query("SELECT * FROM pengeluaran");
    $pengeluaran = [];

    while ($row = $result->fetch_assoc()) {
        $pengeluaran[] = $row;
    }

    echo json_encode($pengeluaran);
}

// Add new Pengeluaran
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data["tanggal"], $data["nominal"], $data["tujuan"], $data["keterangan"])) {
        $tanggal = $data["tanggal"];
        $nominal = $data["nominal"];
        $tujuan = $data["tujuan"];
        $keterangan = $data["keterangan"];

        $mysqli->query("INSERT INTO pengeluaran (tanggal, nominal, tujuan, keterangan) VALUES ('$tanggal', '$nominal', '$tujuan', '$keterangan')");
        echo json_encode(["message" => "Pengeluaran added successfully"]);
    } else {
        echo json_encode(["error" => "Data Pengeluaran is required"]);
    }
}

// Update pengeluaran
if ($_SERVER["REQUEST_METHOD"] === "PUT") {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data["id"], $data["tanggal"], $data["nominal"], $data["tujuan"], $data["keterangan"])) {
        $id = $data["id"];
        $tanggal = $data["tanggal"];
        $nominal = $data["nominal"];
        $tujuan = $data["tujuan"];
        $keterangan = $data["keterangan"];

        $mysqli->query("UPDATE pengeluaran SET tanggal = '$judul', nominal = '$nominal', tujuan = '$tujuan', keterangan = '$keterangan' WHERE id = $id");
        echo json_encode(["message" => "pengeluaran updated successfully"]);
    } else {
        echo json_encode(["error" => "Data Pengeluaran is required"]);
    }
}

if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data["id"])) {
        $id = $data["id"];

        $mysqli->query("DELETE FROM pengeluaran WHERE id = $id");
        echo json_encode(["message" => "Pengeluaran deleted successfully"]);
    } else {
        echo json_encode(["error" => "Data Pengeluaran is required"]);
    }
}


// Close the MySQLi connection
$mysqli->close();
