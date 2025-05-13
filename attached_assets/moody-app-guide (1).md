# Guide de développement complet de l'application Moody

## Table des matières
1. [Introduction et vision du projet](#introduction-et-vision-du-projet)
2. [Architecture technique](#architecture-technique)
3. [Étape 1: Conception et planification](#étape-1-conception-et-planification)
4. [Étape 2: Prototypage et design d'interface](#étape-2-prototypage-et-design-dinterface)
5. [Étape 3: Développement frontend](#étape-3-développement-frontend)
6. [Étape 4: Développement backend](#étape-4-développement-backend)
7. [Étape 5: Intégration et APIs tierces](#étape-5-intégration-et-apis-tierces)
8. [Étape 6: Algorithmes de recommandation](#étape-6-algorithmes-de-recommandation)
9. [Étape 7: Tests et assurance qualité](#étape-7-tests-et-assurance-qualité)
10. [Étape 8: Préparation au lancement](#étape-8-préparation-au-lancement)
11. [Étape 9: Déploiement et mise en production](#étape-9-déploiement-et-mise-en-production)
12. [Étape 10: Maintenance et itérations](#étape-10-maintenance-et-itérations)
13. [Ressources et outils recommandés](#ressources-et-outils-recommandés)

## Introduction et vision du projet

**Moody** est une application de suivi d'humeur qui se distingue par sa prise en compte des facteurs biologiques, notamment le cycle menstruel pour les utilisatrices, afin de proposer des recommandations personnalisées pour améliorer le bien-être quotidien.

**Objectifs principaux:**
- Permettre aux utilisateurs de suivre leur humeur quotidienne via une interface intuitive
- Analyser les données émotionnelles avec une corrélation aux facteurs biologiques
- Fournir des recommandations personnalisées (vidéos, musique, citations, activités)
- Visualiser l'évolution de l'humeur à travers le temps
- Intégrer des applications spécialisées comme Flo pour un suivi menstruel

## Architecture technique

### Stack technologique recommandée

**Frontend:**
- Framework: React Native (pour applications iOS et Android)
- State management: Redux ou Context API
- Design system: Tailwind CSS ou styled-components
- Animations: React Native Animated ou Lottie

**Backend:**
- Runtime: Node.js avec Express.js 
- Base de données: SQLite (comme mentionné dans le cahier des charges)
- ORM: Sequelize ou Prisma
- Authentification: JWT (JSON Web Tokens)

**Services Cloud:**
- Hébergement backend: AWS, Firebase ou Heroku
- Stockage média: AWS S3 ou Firebase Storage
- Analytics: Firebase Analytics, Mixpanel ou Amplitude

**DevOps:**
- CI/CD: GitHub Actions ou CircleCI
- Monitoring: Sentry pour le suivi des erreurs

## Étape 1: Conception et planification

### 1.1 Analyse des besoins détaillés

Commencez par détailler les fonctionnalités prioritaires et secondaires:

**Fonctionnalités prioritaires (MVP):**
- Inscription et connexion avec gestion des profils
- Enregistrement quotidien de l'humeur via émojis
- Visualisation basique de l'historique d'humeur
- Recommandations simples basées sur l'humeur actuelle
- Pour les utilisatrices: suivi du cycle menstruel

**Fonctionnalités secondaires (post-MVP):**
- Analyse avancée des tendances émotionnelles
- Intégration complète avec Flo et d'autres applications
- Recommandations avancées basées sur l'apprentissage
- Exportation des données et partage avec des professionnels

### 1.2 Création du modèle de données

Définissez les principales entités et leurs relations:

```
User:
  - id (PK)
  - name
  - email
  - passwordHash
  - gender
  - lastMenstrualCycle (nullable)
  - createdAt
  - updatedAt

MoodEntry:
  - id (PK)
  - userId (FK)
  - moodType (enum: VERY_HAPPY, HAPPY, NEUTRAL, SAD, etc.)
  - note (text)
  - date
  - createdAt
  - updatedAt

MenstrualCycle:
  - id (PK)
  - userId (FK)
  - startDate
  - endDate (nullable)
  - symptoms (JSON)
  - createdAt
  - updatedAt

Recommendation:
  - id (PK)
  - type (enum: VIDEO, MUSIC, QUOTE, ACTIVITY)
  - content (text/url)
  - moodTarget (enum - which moods it targets)
  - tags (array)
  - createdAt
  - updatedAt

UserPreference:
  - id (PK)
  - userId (FK)
  - preferenceType
  - preferenceValue
  - createdAt
  - updatedAt
```

### 1.3 Plan de développement détaillé

Créez un planning avec des jalons clairs:

**Semaines 1-2: Conception et prototypage**
- Finaliser wireframes et maquettes haute-fidélité
- Définir charte graphique
- Créer prototype interactif
- Valider l'UX avec des utilisateurs tests

**Semaines 3-5: Développement core**
- Mettre en place l'environnement de développement
- Développer l'authentification et la gestion des profils
- Créer les écrans principaux et la navigation
- Implémenter le système de suivi d'humeur
- Développer la base de données et les API

**Semaine 6: Intégrations**
- Développer l'API d'intégration avec Flo
- Implémenter les recommandations de base
- Créer les visualisations d'humeur simples

**Semaine 7: Tests**
- Tests unitaires et d'intégration
- Tests utilisateurs et collecte de feedback
- Corrections de bugs

**Semaine 8: Préparation au lancement**
- Optimisation des performances
- Finalisation de l'UI/UX
- Préparation des stores (App Store, Google Play)

## Étape 2: Prototypage et design d'interface

### 2.1 Wireframes

Créez des wireframes pour tous les écrans principaux:

1. **Écran d'accueil et onboarding**
   - Logo et nom de l'app
   - Boutons "Se connecter" et "Créer un compte"
   - Courte présentation des bénéfices

2. **Écran d'inscription**
   - Formulaire avec champs essentiels
   - Option de sélection de genre
   - Pour les femmes: champ pour date du dernier cycle

3. **Écran principal de saisie d'humeur**
   - Sélection d'émojis expressifs (ligne horizontale ou grille)
   - Champ de texte pour notes personnelles
   - Date du jour (modifiable)
   - Bouton de validation

4. **Écran de recommandations**
   - Sections pour vidéos, musique, citations et activités
   - Contenu adapté à l'humeur sélectionnée
   - Possibilité de marquer comme favori ou "pas intéressé"

5. **Tableau de bord analytique**
   - Graphique d'évolution mensuelle
   - Pour les utilisatrices: corrélation avec cycle menstruel
   - Statistiques d'humeur (humeur dominante, fluctuations)

6. **Profil et paramètres**
   - Informations personnelles
   - Préférences de contenu
   - Options de confidentialité
   - Intégrations avec d'autres apps

### 2.2 Charte graphique

Définissez une identité visuelle apaisante et professionnelle:

**Palette de couleurs:**
- Couleur principale: Bleu apaisant (#4A90E2)
- Couleurs secondaires: 
  - Vert doux (#7ED321)
  - Violet léger (#9013FE)
  - Rose tendre (#FF6B6B)
- Nuances de gris pour le texte
- Couleurs sémantiques pour les humeurs:
  - Très heureux: Jaune vif (#FFD700)
  - Heureux: Vert clair (#7ED321)
  - Neutre: Bleu clair (#4A90E2)
  - Triste: Bleu-gris (#738CA6)
  - Très triste: Violet foncé (#5B2C6F)
  - Anxieux: Orange (#F5A623)
  - Énergique: Rouge vif (#FF3B30)

**Typographie:**
- Titres: Roboto ou SF Pro Display (semi-bold)
- Corps de texte: Roboto ou SF Pro Text (regular)
- Taille de base: 16px avec échelle de type pour hiérarchie

**Iconographie:**
- Style épuré et moderne
- Cohérence dans l'ensemble des écrans
- Émojis personnalisés pour représenter les humeurs

### 2.3 Prototype interactif

Utilisez un outil comme Figma, Adobe XD ou InVision pour créer un prototype cliquable qui simule les principales interactions:

- Parcours d'inscription et connexion
- Sélection quotidienne d'humeur
- Navigation entre les différents écrans
- Affichage des recommandations
- Consultation des analyses

## Étape 3: Développement frontend

### 3.1 Structure du projet React Native

```
src/
  ├── assets/        # Images, fonts, etc.
  ├── components/    # Composants réutilisables
  │   ├── common/    # Boutons, inputs, etc.
  │   ├── mood/      # Composants liés à l'humeur
  │   └── charts/    # Visualisations et graphiques
  ├── navigation/    # Configuration de la navigation
  ├── screens/       # Écrans de l'application
  │   ├── auth/      # Connexion, inscription
  │   ├── main/      # Écran principal, saisie d'humeur
  │   ├── analytics/ # Visualisations et tendances
  │   └── settings/  # Profil et paramètres
  ├── services/      # Services API, authentification
  ├── store/         # État global (Redux/Context)
  ├── utils/         # Fonctions utilitaires
  └── App.js         # Point d'entrée
```

### 3.2 Configuration de l'environnement

```bash
# Créer un nouveau projet React Native
npx react-native init MoodyApp

# Installer les dépendances principales
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install redux react-redux @reduxjs/toolkit
npm install axios moment react-native-svg react-native-chart-kit
npm install react-native-gesture-handler react-native-reanimated
```

### 3.3 Développement des composants clés

Voici quelques exemples de composants essentiels à implémenter:

**MoodSelector.js - Sélecteur d'humeur avec émojis**
```jsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const moods = [
  { id: 'very_happy', emoji: '😄', label: 'Très heureux' },
  { id: 'happy', emoji: '🙂', label: 'Heureux' },
  { id: 'neutral', emoji: '😐', label: 'Neutre' },
  { id: 'sad', emoji: '😔', label: 'Triste' },
  { id: 'very_sad', emoji: '😢', label: 'Très triste' },
  { id: 'anxious', emoji: '😰', label: 'Anxieux' },
  { id: 'energetic', emoji: '⚡', label: 'Énergique' }
];

const MoodSelector = ({ onSelect, selectedMood }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comment vous sentez-vous aujourd'hui ?</Text>
      <View style={styles.moodContainer}>
        {moods.map(mood => (
          <TouchableOpacity
            key={mood.id}
            style={[
              styles.moodItem,
              selectedMood === mood.id && styles.selectedMood
            ]}
            onPress={() => onSelect(mood.id)}
          >
            <Text style={styles.emoji}>{mood.emoji}</Text>
            <Text style={styles.label}>{mood.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  moodItem: {
    alignItems: 'center',
    margin: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  selectedMood: {
    backgroundColor: '#e0e0ff',
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  emoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
  },
});

export default MoodSelector;
```

**MoodChart.js - Graphique d'évolution d'humeur**
```jsx
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

// Conversion numérique des humeurs pour le graphique
// very_happy: 5, happy: 4, neutral: 3, sad: 2, very_sad: 1, etc.
const moodToValue = {
  very_happy: 5,
  happy: 4,
  neutral: 3,
  sad: 2,
  very_sad: 1,
  anxious: 2.5,
  energetic: 4.5
};

const MoodChart = ({ moodEntries }) => {
  // Préparer les données pour le graphique
  const data = {
    labels: moodEntries.map(entry => entry.date.substring(5)), // Format "MM-DD"
    datasets: [
      {
        data: moodEntries.map(entry => moodToValue[entry.moodType]),
        color: () => '#4A90E2',
        strokeWidth: 2
      }
    ],
    legend: ["Évolution de l'humeur"]
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Votre humeur ce mois-ci</Text>
      <LineChart
        data={data}
        width={Dimensions.get('window').width - 32}
        height={220}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
          labelColor: () => '#333333',
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#4A90E2'
          }
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16
  }
});

export default MoodChart;
```

**RecommendationCard.js - Carte de recommandation**
```jsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const RecommendationCard = ({ recommendation, onPress }) => {
  const { type, title, description, imageUrl } = recommendation;

  const getTypeIcon = () => {
    switch (type) {
      case 'VIDEO': return '🎬';
      case 'MUSIC': return '🎵';
      case 'QUOTE': return '💭';
      case 'ACTIVITY': return '🏃‍♀️';
      default: return '✨';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{getTypeIcon()}</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      </View>
      {imageUrl && (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginLeft: 12,
  },
});

export default RecommendationCard;
```

## Étape 4: Développement backend

### 4.1 Configuration du serveur Express

```javascript
// File: server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/mood', require('./routes/mood'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/api/menstrual', require('./routes/menstrual'));
app.use('/api/analytics', require('./routes/analytics'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

// Start server
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    
    await sequelize.sync();
    console.log('Database synced.');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

startServer();
```

### 4.2 Modèles Sequelize

```javascript
// File: models/User.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: false
    },
    lastMenstrualCycle: {
      type: DataTypes.DATE,
      allowNull: true
    }
  });

  User.associate = models => {
    User.hasMany(models.MoodEntry, {
      foreignKey: 'userId',
      as: 'moodEntries'
    });
    
    User.hasMany(models.MenstrualCycle, {
      foreignKey: 'userId',
      as: 'menstrualCycles'
    });
    
    User.hasMany(models.UserPreference, {
      foreignKey: 'userId',
      as: 'preferences'
    });
  };

  return User;
};

// File: models/MoodEntry.js
module.exports = (sequelize, DataTypes) => {
  const MoodEntry = sequelize.define('MoodEntry', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    moodType: {
      type: DataTypes.ENUM(
        'very_happy', 
        'happy', 
        'neutral', 
        'sad', 
        'very_sad', 
        'anxious', 
        'energetic'
      ),
      allowNull: false
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  });

  return MoodEntry;
};
```

### 4.3 Routes API

```javascript
// File: routes/mood.js
const express = require('express');
const router = express.Router();
const { MoodEntry } = require('../models');
const auth = require('../middleware/auth');

// Create mood entry
router.post('/', auth, async (req, res) => {
  try {
    const { moodType, note, date } = req.body;
    
    const newEntry = await MoodEntry.create({
      userId: req.user.id,
      moodType,
      note,
      date: date || new Date()
    });
    
    res.status(201).json(newEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's mood entries
router.get('/', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { userId: req.user.id };
    
    if (startDate && endDate) {
      query.date = {
        [Op.between]: [startDate, endDate]
      };
    }
    
    const entries = await MoodEntry.findAll({
      where: query,
      order: [['date', 'DESC']]
    });
    
    res.json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get mood entry by id
router.get('/:id', auth, async (req, res) => {
  try {
    const entry = await MoodEntry.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    
    res.json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update mood entry
router.put('/:id', auth, async (req, res) => {
  try {
    const entry = await MoodEntry.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    
    const { moodType, note } = req.body;
    
    await entry.update({
      moodType: moodType || entry.moodType,
      note: note || entry.note
    });
    
    res.json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete mood entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const entry = await MoodEntry.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    
    await entry.destroy();
    
    res.json({ message: 'Entry deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
```

### 4.4 Middleware d'authentification

```javascript
// File: middleware/auth.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by id
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};
```

## Étape 5: Intégration et APIs tierces

### 5.1 Intégration avec Flo (API de suivi menstruel)

```javascript
// File: services/floApiService.js
const axios = require('axios');

const floApiBaseUrl = 'https://api.flo.health'; // URL fictive pour l'exemple

class FloApiService {
  constructor(apiKey) {
    this.apiClient = axios.create({
      baseURL: floApiBaseUrl,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  // Récupérer les données du cycle menstruel
  async getCycleData(userId, startDate, endDate) {
    try {
      const response = await this.apiClient.get('/v1/cycle', {
        params: { user_id: userId, start_date: startDate, end_date: endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching Flo cycle data:', error);
      throw error;
    }
  }

  // Synchroniser un cycle menstruel avec Flo
  async syncCycleData(userId, cycleData) {
    try {
      const response = await this.apiClient.post('/v1/cycle/sync', {
        user_id: userId,
        cycle_data: cycleData
      });
      return response.data;
    } catch (error) {
      console.error('Error syncing cycle data with Flo:', error);
      throw error;
    }
  }
}

module.exports = FloApiService;
```

### 5.2 Services pour les recommandations

```javascript
// File: services/recommendationService.js
const { Recommendation } = require('../models');
const { MoodEntry } = require('../models');
const { User } = require('../models');

class RecommendationService {
  // Obtenir des recommandations basées sur l'humeur actuelle
  async getRecommendationsForMood(moodType, userId, limit = 5) {
    try {
      // Récupérer l'utilisateur pour connaître le genre
      const user = await User.findByPk(userId);
      
      // Définir les tags de recherche en fonction de l'humeur
      let targetTags = [];
      
      switch (moodType) {
        case 'very_happy':
          targetTags = ['joie', 'célébration', 'énergie positive'];
          break;
        case 'happy':
          targetTags = ['bonheur', 'motivation', 'optimisme'];
          break;
        case 'neutral':
          targetTags = ['équilibre', 'méditation', 'pleine conscience'];
          break;
        case 'sad':
          targetTags = ['réconfort', 'calme', 'introspection'];
          break;
        case 'very_sad':
          targetTags = ['réconfort', 'soutien', 'acceptation'];
          break;
        case 'anxious':
          targetTags = ['relaxation', 'respiration', 'anti-stress'];
          break;
        case 'energetic':
          targetTags = ['dynamisme', 'motivation', 'créativité'];
          